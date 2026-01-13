import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Bot {
  id: number;
  name: string;
  description: string;
  category: string;
  users: string;
  rating: number;
  verified: boolean;
}

interface BotsProps {
  onBack: () => void;
}

export const Bots = ({ onBack }: BotsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const bots: Bot[] = [
    { id: 1, name: 'ChatGPT', description: 'ИИ-ассистент для ответов на вопросы', category: 'ai', users: '5M+', rating: 4.9, verified: true },
    { id: 2, name: 'Музыка', description: 'Слушайте и скачивайте музыку', category: 'entertainment', users: '3M+', rating: 4.7, verified: true },
    { id: 3, name: 'Новости', description: 'Актуальные новости со всего мира', category: 'news', users: '2M+', rating: 4.5, verified: false },
    { id: 4, name: 'Переводчик', description: 'Мгновенный перевод на 100+ языков', category: 'productivity', users: '4M+', rating: 4.8, verified: true },
    { id: 5, name: 'Погода', description: 'Прогноз погоды и уведомления', category: 'utility', users: '1M+', rating: 4.6, verified: false },
    { id: 6, name: 'Напоминания', description: 'Создавайте напоминания и задачи', category: 'productivity', users: '800K+', rating: 4.4, verified: false },
  ];

  const categories = [
    { id: 'all', name: 'Все', icon: 'Grid3x3' },
    { id: 'ai', name: 'ИИ', icon: 'Brain' },
    { id: 'entertainment', name: 'Развлечения', icon: 'Music' },
    { id: 'productivity', name: 'Продуктивность', icon: 'Briefcase' },
    { id: 'utility', name: 'Утилиты', icon: 'Wrench' },
    { id: 'news', name: 'Новости', icon: 'Newspaper' },
  ];

  const filteredBots = bots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          bot.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || bot.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen bg-background">
      <div className="w-full max-w-6xl mx-auto flex flex-col min-w-0">
        <div className="p-3 md:p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="rounded-full h-9 w-9 md:h-10 md:w-10"
              >
                <Icon name="ArrowLeft" size={18} className="md:w-5 md:h-5" />
              </Button>
              <h1 className="text-xl md:text-2xl font-bold">Боты</h1>
            </div>
          </div>
          
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Поиск ботов..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-2 focus:border-primary transition-all text-sm md:text-base"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3 md:p-4">
            <div className="flex gap-1.5 md:gap-2 mb-4 md:mb-6 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full whitespace-nowrap text-xs md:text-sm h-9 md:h-10 px-3 md:px-4 ${
                    selectedCategory === category.id 
                      ? 'gradient-primary text-white' 
                      : ''
                  }`}
                >
                  <Icon name={category.icon as any} size={16} className="mr-2" />
                  {category.name}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBots.map((bot) => (
                <Card key={bot.id} className="glass-dark hover:shadow-lg transition-all cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <Avatar className="w-16 h-16 gradient-secondary">
                        <AvatarFallback className="text-white text-2xl font-bold">
                          {bot.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {bot.verified && (
                        <Badge className="gradient-primary text-white">
                          <Icon name="BadgeCheck" size={14} className="mr-1" />
                          Проверен
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      {bot.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {bot.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Icon name="Users" size={14} />
                          <span>{bot.users}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Star" size={14} className="fill-yellow-500 text-yellow-500" />
                          <span>{bot.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full gradient-primary text-white hover:opacity-90 rounded-xl group-hover:scale-105 transition-transform">
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredBots.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center opacity-50">
                  <Icon name="SearchX" size={48} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Боты не найдены</h3>
                <p className="text-muted-foreground">Попробуйте изменить поисковый запрос</p>
              </div>
            )}

            <Card className="mt-6 gradient-secondary text-white border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Создайте своего бота</CardTitle>
                <CardDescription className="text-white/80">
                  Используйте наш конструктор для создания уникального бота
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="bg-white text-primary hover:bg-white/90 rounded-xl">
                  <Icon name="Sparkles" size={16} className="mr-2" />
                  Создать бота
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};