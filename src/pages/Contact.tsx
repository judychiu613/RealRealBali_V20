import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { IMAGES } from '@/assets/images';
import { supabase } from '@/integrations/supabase/client';
import { TRANSLATIONS } from '@/lib/index';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { CountryCodeSelector } from '@/components/CountryCodeSelector';
import { getDefaultCountry } from '@/data/countryCodes';
const createContactSchema = (t: any) => z.object({
  name: z.string().min(2, {
    message: t.contact.form.nameError
  }),
  email: z.string().email({
    message: t.contact.form.emailError
  }),
  countryCode: z.string().min(1, {
    message: 'Country code is required'
  }),
  phone: z.string().min(8, {
    message: t.contact.form.phoneError
  }),
  subject: z.string().optional(),
  message: z.string().min(10, {
    message: t.contact.form.messageError
  })
});
type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;

/**
 * 联系我们页面 - 采用静奢风设计
 * 包含联系信息展示与预约咨询表单
 */
export default function Contact() {
  const {
    language
  } = useApp();
  const t = TRANSLATIONS[language];
  const {
    toast
  } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(createContactSchema(t)),
    defaultValues: {
      name: '',
      email: '',
      countryCode: getDefaultCountry().dialCode,
      phone: '',
      subject: '',
      message: ''
    }
  });
  const onSubmit = async (data: ContactFormValues) => {
    try {
      // 准备提交数据
      const inquiryData = {
        inquiry_type: 'contact_form' as const,
        name: data.name,
        email: data.email,
        country_code: data.countryCode,
        phone: data.phone,
        subject: data.subject || '',
        message: data.message,
        preferred_language: language
      };

      // 调用API提交咨询
      const {
        data: result,
        error
      } = await supabase.functions.invoke('user_inquiries_api_2026_02_22_18_30', {
        body: inquiryData
      });
      if (error) {
        throw error;
      }
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit inquiry');
      }
      toast({
        title: t.contact.form.success.split('!')[0],
        description: t.contact.form.success
      });
      reset();
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: language === 'zh' ? '提交失败' : 'Submission Failed',
        description: language === 'zh' ? '提交失败，请稍后重试。' : 'Failed to submit. Please try again later.',
        variant: 'destructive'
      });
    }
  };
  return (
    <>
      <SEOHead
        title={language === 'zh' ? '联系我们 - REAL REAL' : 'Contact Us - REAL REAL'}
        description={language === 'zh'
          ? '联系 REAL REAL 巴厘岛房产中介，获取专业的房产咨询服务'
          : 'Contact REAL REAL Bali property agency for professional property consultation'}
      />
      <div className="min-h-screen bg-background pt-20">
      {/* Hero 视觉区 */}
      

      <section className="luxury-section luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* 左侧：联系信息 */}
          <motion.div initial={{
          opacity: 0,
          x: -30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }} className="lg:col-span-5 space-y-16">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-2xl font-light tracking-tight">{t.contact.info.title}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t.contact.info.subtitle}
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{language === 'zh' ? '办公室地址' : 'Office Address'}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Jl. Pantai Batu Bolong No. 117X, Canggu, <br />
                      Badung, Bali 80361, Indonesia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{language === 'zh' ? '联络热线' : 'Phone'}</h3>
                    <p className="text-sm text-muted-foreground">+62 0813 3067 6565 ({language === 'zh' ? 'WhatsApp 可用' : 'WhatsApp Available'})</p>
                    <p className="text-sm text-muted-foreground">+86 156 0600 2201 ({language === 'zh' ? 'Wechat 可用' : 'Wechat Available'})</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{language === 'zh' ? '电子邮件' : 'Email'}</h3>
                    <p className="text-sm text-muted-foreground">Hello@realrealbali.com</p>
                    <p className="text-sm text-muted-foreground">Judy@realrealbali.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{language === 'zh' ? '服务时间' : 'Business Hours'}</h3>
                    <p className="text-sm text-muted-foreground">{language === 'zh' ? '周一至周五: 09:00 - 18:00 (GMT+8)' : 'Monday - Friday: 09:00 - 18:00 (GMT+8)'}</p>
                    <p className="text-sm text-muted-foreground">{language === 'zh' ? '周末: 10:00 - 16:00 (预约制服务)' : 'Weekend: 10:00 - 16:00 (By Appointment)'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-muted/30 border-l-2 border-primary">
              <p className="text-sm text-muted-foreground italic leading-loose">
                {language === 'zh' ? '"在 REAL REAL，我们不仅仅是在销售房产。我们是在为您构建一种与巴厘岛自然灵魂共鸣的生活方式。每一次握手，都是一段非凡旅程的开始。"' : '"At REAL REAL, we are not just selling properties. We are building a lifestyle that resonates with Bali\'s natural soul. Every handshake is the beginning of an extraordinary journey."'}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">{language === 'zh' ? '— 首席执行顾问' : '— Chief Executive Consultant'}</p>
            </div>
          </motion.div>

          {/* 右侧：联系表单 */}
          <motion.div initial={{
          opacity: 0,
          x: 30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }} className="lg:col-span-7">
            <div className="luxury-card p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MessageSquare className="w-32 h-32" />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-light mb-2">{t.contact.formTitle}</h2>
                <p className="text-muted-foreground mb-10">{t.contact.formSubtitle}</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-medium uppercase tracking-wider">{t.contact.form.name}</Label>
                      <Input id="name" placeholder={t.contact.form.namePlaceholder} {...register('name')} className={`h-12 rounded-none border-x-0 border-t-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary transition-all ${errors.name ? 'border-destructive' : 'border-border'}`} />
                      {errors.name && <p className="text-[10px] text-destructive mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-medium uppercase tracking-wider">{t.contact.form.phone}</Label>
                      <div className="flex gap-2">
                        <Controller name="countryCode" control={control} render={({
                        field
                      }) => <CountryCodeSelector value={field.value} onValueChange={field.onChange} className="text-sm" />} />
                        <Controller name="phone" control={control} render={({
                        field
                      }) => <Input {...field} placeholder={t.contact.form.phonePlaceholder} className={`h-12 rounded-none border-x-0 border-t-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary transition-all flex-1 ${errors.phone ? 'border-destructive' : 'border-border'}`} />} />
                      </div>
                      {errors.phone && <p className="text-[10px] text-destructive mt-1">{errors.phone.message}</p>}
                      {errors.countryCode && <p className="text-[10px] text-destructive mt-1">{errors.countryCode.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider">{t.contact.form.email}</Label>
                    <Input id="email" type="email" placeholder={t.contact.form.emailPlaceholder} {...register('email')} className={`h-12 rounded-none border-x-0 border-t-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary transition-all ${errors.email ? 'border-destructive' : 'border-border'}`} />
                    {errors.email && <p className="text-[10px] text-destructive mt-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-xs font-medium uppercase tracking-wider">{t.contact.form.subject}</Label>
                    <Input id="subject" placeholder={t.contact.form.subjectPlaceholder} {...register('subject')} className="h-12 rounded-none border-x-0 border-t-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary border-border" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-medium uppercase tracking-wider">{t.contact.form.message}</Label>
                    <Textarea id="message" placeholder={t.contact.form.messagePlaceholder} rows={4} {...register('message')} className={`rounded-none border-x-0 border-t-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary transition-all resize-none ${errors.message ? 'border-destructive' : 'border-border'}`} />
                    {errors.message && <p className="text-[10px] text-destructive mt-1">{errors.message.message}</p>}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="luxury-button w-full h-14 text-sm font-medium tracking-[0.2em] uppercase transition-all hover:scale-[1.01]">
                    {isSubmitting ? <span className="flex items-center gap-3">
                        <motion.div animate={{
                      rotate: 360
                    }} transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: 'linear'
                    }} className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                        {t.contact.form.submitting}
                      </span> : <span className="flex items-center gap-3">
                        {t.contact.form.submit} <Send className="w-4 h-4" />
                      </span>}
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 地图视觉引导区 */}
      <section className="h-[600px] w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-muted grayscale contrast-75">
          <img src={IMAGES.BALI_LANDSCAPE_9} alt="Map Concept" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white flex items-center justify-center rounded-full shadow-2xl mb-4 mx-auto animate-bounce">
                <MapPin className="text-primary w-8 h-8" />
              </div>
              <p className="text-sm font-medium tracking-widest uppercase">Canggu, Bali</p>
              <p className="text-xs text-muted-foreground mt-1">点击地图查看详细导航</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-12 md:left-24">
          <div className="luxury-glass p-8 max-w-sm">
            <h4 className="text-xl font-light mb-3">{language === 'zh' ? '旗舰办公室' : 'Flagship Office'}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {language === 'zh' ? '位于巴厘岛核心区域，为您提供最直接、最专业的面对面房产咨询服务。欢迎随时菅临。' : 'Located in the heart of Bali, providing you with the most direct and professional face-to-face property consulting services. Welcome to visit anytime.'}
            </p>
            <Button variant="link" className="px-0 mt-4 text-primary font-semibold tracking-wider text-xs uppercase">
              {language === 'zh' ? '获取导航路线 →' : 'Get Directions →'}
            </Button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}