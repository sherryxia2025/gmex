"use client";

import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (file: File) => Promise<{
    success: boolean;
    data?: {
      total: number;
      imported: number;
      failed: number;
      errors: Array<{ row: number; error: string }>;
    };
    error?: string;
  }>;
  title: string;
  description: string;
  accept?: string;
}

export function ImportDialog({
  open,
  onOpenChange,
  onImport,
  title,
  description,
  accept = ".csv,.json",
}: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    total: number;
    imported: number;
    failed: number;
    errors: Array<{ row: number; error: string }>;
  } | null>(null);
  const t = useTranslations("common");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await onImport(file);
      if (response.success && response.data) {
        setResult(response.data);
        if (response.data.failed === 0) {
          // Auto close on success
          setTimeout(() => {
            handleClose();
            window.location.reload();
          }, 2000);
        }
      } else {
        setResult({
          total: 0,
          imported: 0,
          failed: 0,
          errors: [{ row: 0, error: response.error || "导入失败" }],
        });
      }
    } catch (error) {
      setResult({
        total: 0,
        imported: 0,
        failed: 0,
        errors: [
          {
            row: 0,
            error: error instanceof Error ? error.message : "未知错误",
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">点击上传</span> 或拖拽文件到此处
                </p>
                <p className="text-xs text-muted-foreground">
                  支持 CSV 或 JSON 格式
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept={accept}
                onChange={handleFileChange}
                disabled={loading}
              />
            </label>
            {file && (
              <p className="text-sm text-muted-foreground">
                已选择: {file.name}
              </p>
            )}
          </div>

          {result && (
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">导入结果</span>
                <span className="text-sm text-muted-foreground">
                  {result.imported}/{result.total} 成功
                </span>
              </div>
              {result.failed > 0 && (
                <div className="text-sm text-destructive">
                  失败: {result.failed} 条
                </div>
              )}
              {result.errors.length > 0 && (
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {result.errors.map((error, idx) => (
                    <div key={idx} className="text-xs text-destructive">
                      第 {error.row} 行: {error.error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            取消
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={!file || loading}
          >
            {loading ? "导入中..." : "导入"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

