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
    <div className="min-h-screen flex items-center justify-center gradient-secondary p-4">
      <Card className="w-full max-w-md glass border-2 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="w-20 h-20 mx-auto gradient-primary rounded-3xl flex items-center justify-center mb-4 animate-scale-in">
            <Icon name="MessageCircle" size={40} className="text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">
            {isLogin ? 'Вход' : 'Регистрация'}
          </CardTitle>
          <CardDescription className="text-base">
            {isLogin 
              ? 'Войдите в свой аккаунт для продолжения' 
              : 'Создайте аккаунт для начала общения'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border-2 focus:border-primary"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-2 focus:border-primary"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-2 focus:border-primary"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full gradient-primary text-white hover:opacity-90 rounded-xl h-11 text-base font-semibold"
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin 
                ? 'Нет аккаунта? Зарегистрируйтесь' 
                : 'Уже есть аккаунт? Войдите'}
            </button>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">или продолжите с</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="rounded-xl h-11 hover:bg-muted/50"
                onClick={() => onLogin('Google User', 'google@user.com')}
              >
                <Icon name="Chrome" size={20} className="mr-2" />
                Google
              </Button>
              <Button 
                variant="outline" 
                className="rounded-xl h-11 hover:bg-muted/50"
                onClick={() => onLogin('GitHub User', 'github@user.com')}
              >
                <Icon name="Github" size={20} className="mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
