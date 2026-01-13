import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AuthProps {
  onLogin: (name: string, email: string) => void;
}

export const Auth = ({ onLogin }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(name || email.split('@')[0], email);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-secondary p-3 md:p-4">
      <Card className="w-full max-w-md glass border-2 shadow-2xl mx-auto">
        <CardHeader className="space-y-2 text-center px-4 md:px-6">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto gradient-primary rounded-2xl md:rounded-3xl flex items-center justify-center mb-3 md:mb-4 animate-scale-in">
            <Icon name="MessageCircle" size={32} className="text-white md:w-10 md:h-10" />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold">
            {isLogin ? 'Вход' : 'Регистрация'}
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            {isLogin 
              ? 'Войдите в свой аккаунт для продолжения' 
              : 'Создайте аккаунт для начала общения'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-4 md:px-6">
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border-2 focus:border-primary text-sm md:text-base"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm md:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-2 focus:border-primary text-sm md:text-base"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm md:text-base">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-2 focus:border-primary text-sm md:text-base"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full gradient-primary text-white hover:opacity-90 rounded-xl h-10 md:h-11 text-sm md:text-base font-semibold"
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </form>
          
          <div className="mt-4 md:mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin 
                ? 'Нет аккаунта? Зарегистрируйтесь' 
                : 'Уже есть аккаунт? Войдите'}
            </button>
          </div>
          
          <div className="mt-4 md:mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-[10px] md:text-xs">
                <span className="bg-card px-2 text-muted-foreground">или продолжите с</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="rounded-xl h-10 md:h-11 hover:bg-muted/50 text-xs md:text-sm"
                onClick={() => onLogin('Google User', 'google@user.com')}
              >
                <Icon name="Chrome" size={16} className="mr-2 md:w-5 md:h-5" />
                Google
              </Button>
              <Button 
                variant="outline" 
                className="rounded-xl h-10 md:h-11 hover:bg-muted/50 text-xs md:text-sm"
                onClick={() => onLogin('GitHub User', 'github@user.com')}
              >
                <Icon name="Github" size={16} className="mr-2 md:w-5 md:h-5" />
                GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};