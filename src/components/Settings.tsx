import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface SettingsProps {
  user: { name: string; email: string; isPremium: boolean };
  onBack: () => void;
  onLogout: () => void;
  onUpgradePremium: () => void;
}

export const Settings = ({ user, onBack, onLogout, onUpgradePremium }: SettingsProps) => {
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoDownload, setAutoDownload] = useState(true);

  return (
    <div className="flex h-screen bg-background">
      <div className="w-full max-w-4xl mx-auto flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <h1 className="text-2xl font-bold">Настройки</h1>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <Card className="glass-dark border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20 ring-4 ring-primary/20">
                      <AvatarImage src="" />
                      <AvatarFallback className="gradient-primary text-white text-2xl font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl">{user.name}</CardTitle>
                      <CardDescription className="text-base mt-1">{user.email}</CardDescription>
                      {user.isPremium && (
                        <Badge className="mt-2 gradient-accent text-white">
                          <Icon name="Crown" size={14} className="mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-xl">
                    <Icon name="Pencil" size={16} className="mr-2" />
                    Редактировать
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {!user.isPremium && (
              <Card className="gradient-primary border-0 text-white animate-fade-in">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Icon name="Crown" size={28} />
                        Попробуйте Premium
                      </CardTitle>
                      <CardDescription className="text-white/80 text-base">
                        Без рекламы, больше функций и эксклюзивные возможности
                      </CardDescription>
                      <ul className="space-y-2 mt-4">
                        <li className="flex items-center gap-2">
                          <Icon name="Check" size={18} />
                          <span>Без рекламы</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Icon name="Check" size={18} />
                          <span>Голосовые звонки HD качества</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Icon name="Check" size={18} />
                          <span>Эксклюзивные стикеры и темы</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={onUpgradePremium}
                    className="w-full bg-white text-primary hover:bg-white/90 rounded-xl h-11 font-semibold"
                  >
                    Получить Premium за 299₽/мес
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Аккаунт</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Имя пользователя</Label>
                  <Input
                    id="username"
                    defaultValue={user.name}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">О себе</Label>
                  <Input
                    id="bio"
                    placeholder="Расскажите о себе..."
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Уведомления</CardTitle>
                <CardDescription>Настройте, как вы хотите получать уведомления</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="text-base">Уведомления</Label>
                    <p className="text-sm text-muted-foreground">Получать уведомления о сообщениях</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sound" className="text-base">Звук</Label>
                    <p className="text-sm text-muted-foreground">Звуковые уведомления</p>
                  </div>
                  <Switch
                    id="sound"
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Внешний вид</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark" className="text-base">Темная тема</Label>
                    <p className="text-sm text-muted-foreground">Включить темный режим</p>
                  </div>
                  <Switch
                    id="dark"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Данные и хранилище</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autodownload" className="text-base">Автозагрузка медиа</Label>
                    <p className="text-sm text-muted-foreground">Автоматически загружать фото и видео</p>
                  </div>
                  <Switch
                    id="autodownload"
                    checked={autoDownload}
                    onCheckedChange={setAutoDownload}
                  />
                </div>
                <Separator />
                <Button variant="outline" className="w-full rounded-xl">
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Очистить кэш
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Безопасность</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <Icon name="Lock" size={16} className="mr-2" />
                  Изменить пароль
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <Icon name="Shield" size={16} className="mr-2" />
                  Двухфакторная аутентификация
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <Icon name="Eye" size={16} className="mr-2" />
                  Приватность и безопасность
                </Button>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl h-11"
              >
                <Icon name="HelpCircle" size={16} className="mr-2" />
                Помощь
              </Button>
              <Button 
                variant="destructive" 
                onClick={onLogout}
                className="flex-1 rounded-xl h-11"
              >
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
