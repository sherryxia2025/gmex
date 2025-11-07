"use client";

import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface KeyValueFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface KeyValuePair {
  key: string;
  value: string;
}

export function KeyValueField({
  value = "",
  onChange,
  placeholder,
  disabled = false,
  className = "",
}: KeyValueFieldProps) {
  const t = useTranslations("common");
  const [pairs, setPairs] = useState<KeyValuePair[]>([]);

  // 从 JSON 字符串解析初始值
  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === "object" && parsed !== null) {
          const entries = Object.entries(parsed).map(([key, val]) => ({
            key,
            value: String(val),
          }));
          setPairs(entries);
        } else {
          setPairs([]);
        }
      } catch {
        setPairs([]);
      }
    } else {
      setPairs([]);
    }
  }, [value]);

  // 将键值对转换为 JSON 字符串并通知父组件
  const updateValue = (newPairs: KeyValuePair[]) => {
    setPairs(newPairs);
    const obj: Record<string, string> = {};
    newPairs.forEach((pair) => {
      if (pair.key.trim()) {
        obj[pair.key.trim()] = pair.value;
      }
    });
    onChange?.(JSON.stringify(obj));
  };

  const addPair = () => {
    updateValue([...pairs, { key: "", value: "" }]);
  };

  const removePair = (index: number) => {
    const newPairs = pairs.filter((_, i) => i !== index);
    updateValue(newPairs);
  };

  const updatePair = (index: number, field: "key" | "value", newValue: string) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], [field]: newValue };
    updateValue(newPairs);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="space-y-2">
        {pairs.map((pair, index) => (
          <div key={index} className="flex gap-2 items-start">
            <Input
              value={pair.key}
              onChange={(e) => updatePair(index, "key", e.target.value)}
              placeholder={t("key")}
              disabled={disabled}
              className="flex-1"
            />
            <Input
              value={pair.value}
              onChange={(e) => updatePair(index, "value", e.target.value)}
              placeholder={t("value")}
              disabled={disabled}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removePair(index)}
              disabled={disabled}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addPair}
        disabled={disabled}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t("addKeyValuePair")}
      </Button>
    </div>
  );
}

