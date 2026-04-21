import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { type PropertyTag } from '@/lib/index';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Available property tags defined as a constant array for the filter UI
const PROPERTY_TAGS: PropertyTag[] = [
  '靠海滩500米',
  '海景房',
  '自然风景房',
  '私人沙滩',
  '山景房',
  '稻田景观',
  '市中心',
  '高尔夫球场',
  '温泉度假村'
];

interface PropertyFilterProps {
  selectedTags: PropertyTag[];
  onTagToggle: (tag: PropertyTag) => void;
  onClearAll: () => void;
}

export function PropertyFilter({ selectedTags, onTagToggle, onClearAll }: PropertyFilterProps) {
  return (
    <div className="bg-background border-t border-border/20 py-6">
      <div className="container mx-auto px-8">
        <div className="flex flex-col gap-4">
          {/* 标题和清除按钮 */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium tracking-[0.2em] uppercase text-foreground/60">
              筛选标签
            </h3>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-xs text-foreground/60 hover:text-foreground px-3 py-1 h-auto"
              >
                <X className="w-3 h-3 mr-1" />
                清除全部
              </Button>
            )}
          </div>

          {/* 标签列表 */}
          <div className="flex flex-wrap gap-3">
            {PROPERTY_TAGS.map((tag: PropertyTag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <motion.button
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 text-xs font-medium transition-all duration-200 border ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground/70 border-foreground/20 hover:border-foreground/40 hover:text-foreground'
                  }`}
                >
                  {tag}
                </motion.button>
              );
            })}
          </div>

          {/* 已选择的标签显示 */}
          {selectedTags.length > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t border-border/10">
              <span className="text-xs text-foreground/50">已选择:</span>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-foreground/10 text-foreground border-none px-3 py-1 text-xs cursor-pointer hover:bg-foreground/20"
                    onClick={() => onTagToggle(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
