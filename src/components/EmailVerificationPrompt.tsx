import React from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

interface EmailVerificationPromptProps {
  email: string;
  onClose: () => void;
  onResendVerification?: () => void;
}

export function EmailVerificationPrompt({ 
  email, 
  onClose, 
  onResendVerification 
}: EmailVerificationPromptProps) {
  const { language } = useApp();

  const translations = {
    zh: {
      title: '验证您的邮箱',
      subtitle: '注册成功！请验证您的邮箱以完成注册',
      description: '我们已向您的邮箱发送了一封验证邮件：',
      instructions: '请按照以下步骤完成验证：',
      step1: '1. 查看您的收件箱',
      step2: '2. 点击邮件中的验证链接',
      step3: '3. 如果没有收到邮件，请检查垃圾邮件文件夹',
      noEmail: '没有收到邮件？',
      resend: '重新发送验证邮件',
      close: '我知道了',
      checkSpam: '请务必检查垃圾邮件文件夹，验证邮件可能被误判为垃圾邮件。'
    },
    en: {
      title: 'Verify Your Email',
      subtitle: 'Registration successful! Please verify your email to complete registration',
      description: 'We have sent a verification email to:',
      instructions: 'Please follow these steps to complete verification:',
      step1: '1. Check your inbox',
      step2: '2. Click the verification link in the email',
      step3: '3. If you don\'t see the email, check your spam folder',
      noEmail: 'Didn\'t receive the email?',
      resend: 'Resend verification email',
      close: 'Got it',
      checkSpam: 'Please make sure to check your spam folder, as verification emails may be filtered as spam.'
    }
  };

  const t = translations[language];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl font-light">
              {t.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {t.subtitle}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 邮箱地址显示 */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {t.description}
              </p>
              <div className="bg-muted/50 rounded-lg p-3 border">
                <p className="font-medium text-sm break-all">
                  {email}
                </p>
              </div>
            </div>

            {/* 验证步骤 */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                {t.instructions}
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {t.step1}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {t.step2}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {t.step3}
                  </p>
                </div>
              </div>
            </div>

            {/* 垃圾邮件提醒 */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  {t.checkSpam}
                </p>
              </div>
            </div>

            {/* 重发邮件选项 */}
            {onResendVerification && (
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {t.noEmail}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onResendVerification}
                  className="text-xs"
                >
                  {t.resend}
                </Button>
              </div>
            )}

            {/* 关闭按钮 */}
            <div className="pt-4">
              <Button 
                onClick={onClose} 
                className="w-full"
                size="sm"
              >
                {t.close}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}