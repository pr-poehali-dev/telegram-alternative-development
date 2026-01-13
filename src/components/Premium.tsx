import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PremiumProps {
  onBack: () => void;
  onUpgrade: (plan: string) => void;
  isPremium: boolean;
}

export const Premium = ({ onBack, onUpgrade, isPremium }: PremiumProps) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'phone'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    monthly: { price: 299, period: 'месяц' },
    yearly: { price: 2990, period: 'год', save: '17%' },
  };

  const features = [
    { icon: 'Zap', title: 'Быстрая скорость', description: 'Приоритетная загрузка сообщений и медиа' },
    { icon: 'Cloud', title: 'Безлимитное облако', description: 'Неограниченное хранилище для файлов' },
    { icon: 'Smile', title: 'Уникальные стикеры', description: 'Эксклюзивные наборы стикеров' },
    { icon: 'Upload', title: 'Большие файлы', description: 'До 4GB на файл вместо 2GB' },
    { icon: 'Users', title: 'Больше чатов', description: 'До 1000 закрепленных чатов' },
    { icon: 'Sparkles', title: 'Уникальный профиль', description: 'Анимированный аватар и значок' },
    { icon: 'ShieldCheck', title: 'Приватность+', description: 'Расширенные настройки приватности' },
    { icon: 'Palette', title: 'Темы', description: 'Кастомные цветовые схемы' },
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onUpgrade(selectedPlan);
    setIsProcessing(false);
    setShowPaymentDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Premium</h1>
            <p className="text-sm text-muted-foreground">Расширенные возможности мессенджера</p>
          </div>
        </div>

        {isPremium && (
          <Card className="mb-6 border-2 border-primary gradient-primary text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="Crown" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">Premium активен</h3>
                  <p className="text-white/90">Подписка продлится до 13.02.2026</p>
                </div>
                <Button variant="secondary" onClick={() => setShowPaymentDialog(true)}>
                  Продлить
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!isPremium && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card 
              className={`cursor-pointer transition-all border-2 ${
                selectedPlan === 'monthly' ? 'border-primary shadow-lg' : 'border-border'
              }`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Месячная подписка</CardTitle>
                    <CardDescription>Попробуйте Premium</CardDescription>
                  </div>
                  {selectedPlan === 'monthly' && (
                    <Badge className="gradient-primary text-white">Выбрано</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-3xl font-bold">{plans.monthly.price} ₽</div>
                  <div className="text-sm text-muted-foreground">в {plans.monthly.period}</div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all border-2 relative overflow-hidden ${
                selectedPlan === 'yearly' ? 'border-primary shadow-lg' : 'border-border'
              }`}
              onClick={() => setSelectedPlan('yearly')}
            >
              <div className="absolute top-4 right-4">
                <Badge className="gradient-accent text-white">-{plans.yearly.save}</Badge>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Годовая подписка</CardTitle>
                    <CardDescription>Лучшее предложение</CardDescription>
                  </div>
                  {selectedPlan === 'yearly' && (
                    <Badge className="gradient-primary text-white">Выбрано</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-3xl font-bold">{plans.yearly.price} ₽</div>
                  <div className="text-sm text-muted-foreground">в {plans.yearly.period}</div>
                  <div className="text-sm text-green-600 font-semibold mt-1">
                    Экономия {(plans.monthly.price * 12 - plans.yearly.price)} ₽
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {features.map((feature, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mb-3">
                  <Icon name={feature.icon as any} size={24} className="text-white" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {!isPremium && (
          <Card className="glass-dark border-2 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Crown" size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Готовы к улучшению?</h2>
                <p className="text-muted-foreground mb-6">
                  Получите все преимущества Premium и наслаждайтесь мессенджером без ограничений
                </p>
                <Button 
                  size="lg" 
                  className="gradient-primary text-white px-8"
                  onClick={() => setShowPaymentDialog(true)}
                >
                  <Icon name="Crown" size={20} className="mr-2" />
                  Оформить Premium за {plans[selectedPlan].price} ₽
                </Button>
              </CardContent>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Оплата Premium</DialogTitle>
            <DialogDescription>
              Выберите способ оплаты для активации подписки
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Подписка:</span>
                <span className="font-semibold">
                  {selectedPlan === 'monthly' ? 'Месячная' : 'Годовая'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Стоимость:</span>
                <span className="text-2xl font-bold text-primary">{plans[selectedPlan].price} ₽</span>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Способ оплаты</Label>
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                <div className="flex items-center space-x-3 p-3 rounded-xl border-2 border-border hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Icon name="CreditCard" size={20} className="text-primary" />
                    Банковская карта
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-xl border-2 border-border hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Icon name="Smartphone" size={20} className="text-primary" />
                    Мобильный платеж
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowPaymentDialog(false)}
              disabled={isProcessing}
              className="w-full sm:w-auto"
            >
              Отмена
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="gradient-primary text-white w-full sm:w-auto"
            >
              {isProcessing ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Обработка...
                </>
              ) : (
                <>
                  <Icon name="CheckCircle" size={16} className="mr-2" />
                  Оплатить {plans[selectedPlan].price} ₽
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Premium;
