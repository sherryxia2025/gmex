"use client";

import { CheckCircle2, Clock, Layers, PlayCircle, XCircle } from "lucide-react";
import { unauthorized } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AI_MODEL_CONFIGS, type ModelType } from "@/lib/ai-models-config";
import { useAuth } from "@/store/auth";

interface TestResult {
  model: string;
  status: "pending" | "running" | "success" | "error";
  result?: string | string[] | { text: string };
  error?: string;
  startTime?: number;
  endTime?: number;
}

export default function AIPlaygroundPage() {
  const t = useTranslations("aiPlayground");
  const [activeType, setActiveType] = useState<ModelType>("text-to-text");
  const [prompt, setPrompt] = useState<string>(t("defaultPrompts.textToText"));
  const [imageUrl, setImageUrl] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>(
    {},
  );
  const [isBatchTesting, setIsBatchTesting] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !user) {
      unauthorized();
    }
  }, [isAuthenticated, user]);

  const getDefaultPrompt = (type: ModelType): string => {
    const promptMap: Record<ModelType, string> = {
      "text-to-text": t("defaultPrompts.textToText"),
      "text-to-image": t("defaultPrompts.textToImage"),
      "text-to-video": t("defaultPrompts.textToVideo"),
      "image-to-video": t("defaultPrompts.imageToVideo"),
      "image-to-image": t("defaultPrompts.imageToImage"),
      "remove-bg": t("defaultPrompts.removeBg"),
    };
    return promptMap[type];
  };

  const getModelTypeLabel = (type: ModelType): string => {
    const labelMap: Record<ModelType, string> = {
      "text-to-text": t("modelTypes.textToText"),
      "text-to-image": t("modelTypes.textToImage"),
      "text-to-video": t("modelTypes.textToVideo"),
      "image-to-video": t("modelTypes.imageToVideo"),
      "image-to-image": t("modelTypes.imageToImage"),
      "remove-bg": t("modelTypes.removeBg"),
    };
    return labelMap[type];
  };

  const handleTypeChange = (type: ModelType) => {
    setActiveType(type);
    setPrompt(getDefaultPrompt(type));
    setSelectedModels([]);
    setTestResults({});
  };

  const toggleModelSelection = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model],
    );
  };

  const selectAllModels = () => {
    const allModels = Object.keys(AI_MODEL_CONFIGS[activeType].models);
    setSelectedModels(allModels);
  };

  const deselectAllModels = () => {
    setSelectedModels([]);
  };

  const testSingleModel = async (model: string) => {
    setTestResults((prev) => ({
      ...prev,
      [model]: { model, status: "running", startTime: Date.now() },
    }));

    try {
      let endpoint = "";
      let body: Record<string, unknown> = {};

      switch (activeType) {
        case "text-to-text":
          endpoint = "/api/ai/text-to-text";
          body = { prompt, model };
          break;
        case "text-to-image":
          endpoint = "/api/ai/text-to-image";
          body = { prompt, model };
          break;
        case "text-to-video":
          endpoint = "/api/ai/text-to-video";
          body = { prompt, model };
          break;
        case "image-to-video":
          endpoint = "/api/ai/image-to-video";
          body = { prompt, image: imageUrl, model };
          break;
        case "image-to-image":
          endpoint = "/api/ai/image-to-image";
          body = { prompt, image: imageUrl, model };
          break;
        case "remove-bg":
          endpoint = "/api/ai/remove-bg";
          body = { image: imageUrl, model };
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Request failed");
      }

      if (activeType === "text-to-text") {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let text = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            text += decoder.decode(value);
            setTestResults((prev) => ({
              ...prev,
              [model]: {
                model,
                status: "running",
                result: { text },
                startTime: prev[model]?.startTime,
              },
            }));
          }
        }

        setTestResults((prev) => ({
          ...prev,
          [model]: {
            model,
            status: "success",
            result: { text },
            startTime: prev[model]?.startTime,
            endTime: Date.now(),
          },
        }));
      } else {
        const data = (await response.json()) as { url: string | string[] };
        setTestResults((prev) => ({
          ...prev,
          [model]: {
            model,
            status: "success",
            result: data.url,
            startTime: prev[model]?.startTime,
            endTime: Date.now(),
          },
        }));
      }
    } catch (err) {
      setTestResults((prev) => ({
        ...prev,
        [model]: {
          model,
          status: "error",
          error: err instanceof Error ? err.message : "Unknown error",
          startTime: prev[model]?.startTime,
          endTime: Date.now(),
        },
      }));
    }
  };

  const testAllSelectedModels = async () => {
    if (selectedModels.length === 0) {
      alert(t("selectAtLeastOneModel"));
      return;
    }

    setIsBatchTesting(true);
    setTestResults({});

    const initialResults: Record<string, TestResult> = {};
    for (const model of selectedModels) {
      initialResults[model] = { model, status: "pending" };
    }
    setTestResults(initialResults);

    await Promise.all(selectedModels.map((model) => testSingleModel(model)));

    setIsBatchTesting(false);
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-gray-400" />;
      case "running":
        return <Spinner className="h-4 w-4" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getElapsedTime = (result: TestResult) => {
    if (!result.startTime) return null;
    const endTime = result.endTime || Date.now();
    const elapsed = ((endTime - result.startTime) / 1000).toFixed(2);
    return `${elapsed}s`;
  };

  const renderResult = (result: TestResult) => {
    if (result.status === "pending" || result.status === "running") {
      return (
        <div className="flex items-center justify-center py-8">
          {result.status === "running" && <Spinner className="h-8 w-8" />}
          {result.status === "pending" && (
            <span className="text-gray-400">{t("waitingForTest")}</span>
          )}
        </div>
      );
    }

    if (result.status === "error") {
      return (
        <Alert variant="destructive">
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      );
    }

    if (
      activeType === "text-to-text" &&
      result.result &&
      typeof result.result === "object" &&
      "text" in result.result
    ) {
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <pre className="whitespace-pre-wrap text-sm">
            {result.result.text}
          </pre>
        </div>
      );
    }

    if (
      (activeType === "text-to-image" ||
        activeType === "image-to-image" ||
        activeType === "remove-bg") &&
      result.result
    ) {
      const urls = Array.isArray(result.result)
        ? result.result
        : typeof result.result === "string"
          ? [result.result]
          : [];
      return (
        <div className="space-y-2">
          {urls.map((url) => (
            // biome-ignore lint/performance/noImgElement: test only
            <img
              key={url}
              src={url}
              alt="Generated result"
              className="w-full rounded-lg"
            />
          ))}
        </div>
      );
    }

    if (
      (activeType === "text-to-video" || activeType === "image-to-video") &&
      result.result &&
      typeof result.result === "string"
    ) {
      return (
        <video src={result.result} controls className="w-full rounded-lg">
          <track kind="captions" label="No captions available" />
        </video>
      );
    }

    return null;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Tabs
        value={activeType}
        onValueChange={(v) => handleTypeChange(v as ModelType)}
      >
        <TabsList className="grid w-full grid-cols-6 gap-2 mb-6">
          {Object.entries(AI_MODEL_CONFIGS).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <TabsTrigger
                key={key}
                value={key}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {getModelTypeLabel(key as ModelType)}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(AI_MODEL_CONFIGS).map(([type, config]) => (
          <TabsContent key={type} value={type} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 lg:sticky lg:top-6 h-fit space-y-6">
                <Card className="shadow-none border rounded-md">
                  <CardHeader>
                    <CardTitle>{t("inputConfig")}</CardTitle>
                    <CardDescription>
                      {t("inputConfigDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {"requiresImage" in config && config.requiresImage && (
                      <div className="space-y-2">
                        <Label htmlFor="image-url">{t("imageUrl")}</Label>
                        <Input
                          id="image-url"
                          type="text"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder={t("imageUrlPlaceholder")}
                        />
                      </div>
                    )}

                    {type !== "remove-bg" && (
                      <div className="space-y-2">
                        <Label htmlFor="prompt">{t("prompt")}</Label>
                        <Textarea
                          id="prompt"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          rows={4}
                          placeholder={t("promptPlaceholder")}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Model Selection & Actions */}
                <Card className="shadow-none border rounded-md">
                  <CardHeader>
                    <CardTitle>{t("modelSelection")}</CardTitle>
                    <CardDescription>
                      {t("modelSelectionDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>{t("selectModels")}</Label>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={selectAllModels}
                          >
                            {t("selectAll")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={deselectAllModels}
                          >
                            {t("clear")}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(config.models).map(
                          ([modelId, modelName]) => {
                            const isSelected = selectedModels.includes(modelId);
                            return (
                              <button
                                type="button"
                                key={modelId}
                                onClick={() => toggleModelSelection(modelId)}
                                aria-pressed={isSelected}
                                className={`w-full text-left px-3 py-2 border rounded-md transition focus:outline-none ${
                                  isSelected
                                    ? "border-primary ring-1 ring-primary/30 bg-muted"
                                    : "hover:bg-muted/50"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">
                                    {String(modelName)}
                                  </span>
                                  {isSelected && (
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={testAllSelectedModels}
                      disabled={isBatchTesting || selectedModels.length === 0}
                      className="w-full"
                      size="lg"
                    >
                      {isBatchTesting ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                          {t("testing")}
                        </>
                      ) : (
                        <>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          {t("testSelectedModels")} ({selectedModels.length})
                        </>
                      )}
                    </Button>

                    {selectedModels.length > 1 && (
                      <p className="text-xs text-muted-foreground text-center">
                        {t("parallelTestHint")}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Results Section */}
              <Card className="lg:col-span-8 shadow-none border rounded-md">
                <CardHeader>
                  <CardTitle>{t("testResults")}</CardTitle>
                  <CardDescription>
                    {selectedModels.length > 0
                      ? t("modelsSelected", { count: selectedModels.length })
                      : t("selectModelsToTest")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.keys(testResults).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Layers className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">{t("selectModelsPrompt")}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedModels.map((modelId) => {
                        const result = testResults[modelId];
                        const modelName = (
                          config.models as Record<string, string>
                        )[modelId];
                        return (
                          <Card
                            key={modelId}
                            className="shadow-none border rounded-md"
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(result?.status || "pending")}
                                  <CardTitle className="text-base">
                                    {modelName}
                                  </CardTitle>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => testSingleModel(modelId)}
                                  >
                                    {t("retest")}
                                  </Button>
                                  {result && (
                                    <Badge
                                      variant={
                                        result.status === "success"
                                          ? "default"
                                          : result.status === "error"
                                            ? "destructive"
                                            : "secondary"
                                      }
                                    >
                                      {t(`status.${result.status}`)}
                                    </Badge>
                                  )}
                                  {result && getElapsedTime(result) && (
                                    <Badge variant="outline">
                                      {getElapsedTime(result)}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {result ? (
                                renderResult(result)
                              ) : (
                                <div className="text-gray-400 text-center py-4">
                                  {t("waitingForTest")}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
