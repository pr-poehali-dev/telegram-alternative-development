import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  type: 'personal' | 'group' | 'channel';
}

interface Message {
  id: number;
  text: string;
  time: string;
  sent: boolean;
  read: boolean;
}

const Index = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  const [activeTab, setActiveTab] = useState('chats');

  const chats: Chat[] = [
    { id: 1, name: 'Алексей Смирнов', avatar: '', lastMessage: 'Отлично, встречаемся завтра!', time: '14:32', unread: 2, online: true, type: 'personal' },
    { id: 2, name: 'Команда Разработки', avatar: '', lastMessage: 'Релиз запланирован на пятницу', time: '13:15', unread: 5, online: false, type: 'group' },
    { id: 3, name: 'Мария Иванова', avatar: '', lastMessage: 'Спасибо за помощь! 🙏', time: '12:48', unread: 0, online: true, type: 'personal' },
    { id: 4, name: 'Tech News', avatar: '', lastMessage: 'Новые технологии ИИ в 2026', time: '11:20', unread: 0, online: false, type: 'channel' },
    { id: 5, name: 'Дизайн Комьюнити', avatar: '', lastMessage: 'Кто-нибудь работал с Figma?', time: 'вчера', unread: 12, online: false, type: 'group' },
  ];

  const messages: Message[] = selectedChat ? [
    { id: 1, text: 'Привет! Как дела?', time: '14:20', sent: false, read: true },
    { id: 2, text: 'Здорово! Работаю над новым проектом', time: '14:25', sent: true, read: true },
    { id: 3, text: 'Интересно! Расскажешь подробнее?', time: '14:28', sent: false, read: true },
    { id: 4, text: 'Да, конечно! Создаю мессенджер с ИИ', time: '14:30', sent: true, read: true },
    { id: 5, text: 'Отлично, встречаемся завтра!', time: '14:32', sent: false, read: true },
  ] : [];

  const getChatIcon = (type: string) => {
    switch(type) {
      case 'group': return 'Users';
      case 'channel': return 'Radio';
      default: return 'User';
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="w-20 gradient-primary flex flex-col items-center py-6 space-y-6">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-2xl w-14 h-14">
          <Icon name="MessageCircle" size={28} />
        </Button>
        
        <div className="flex-1 flex flex-col space-y-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`text-white hover:bg-white/20 rounded-2xl w-14 h-14 ${activeTab === 'chats' ? 'bg-white/20' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            <Icon name="MessageSquare" size={24} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={`text-white hover:bg-white/20 rounded-2xl w-14 h-14 ${activeTab === 'calls' ? 'bg-white/20' : ''}`}
            onClick={() => setActiveTab('calls')}
          >
            <Icon name="Phone" size={24} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={`text-white hover:bg-white/20 rounded-2xl w-14 h-14 ${activeTab === 'bots' ? 'bg-white/20' : ''}`}
            onClick={() => setActiveTab('bots')}
          >
            <Icon name="Bot" size={24} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={`text-white hover:bg-white/20 rounded-2xl w-14 h-14 ${activeTab === 'settings' ? 'bg-white/20' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Icon name="Settings" size={24} />
          </Button>
        </div>
        
        <Avatar className="w-12 h-12 ring-2 ring-white/30 cursor-pointer hover:ring-white/50 transition-all">
          <AvatarImage src="" />
          <AvatarFallback className="gradient-accent text-white font-semibold">ВЫ</AvatarFallback>
        </Avatar>
      </div>

      <div className="w-96 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Чаты</h2>
            <Button size="icon" variant="ghost" className="rounded-full hover:gradient-primary hover:text-white transition-all">
              <Icon name="Plus" size={20} />
            </Button>
          </div>
          
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Поиск..." 
              className="pl-10 rounded-full border-2 focus:border-primary transition-all"
            />
          </div>
        </div>

        <Tabs value={activeTab} className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-2 grid grid-cols-3 bg-muted/50">
            <TabsTrigger value="chats" onClick={() => setActiveTab('chats')}>Все</TabsTrigger>
            <TabsTrigger value="groups" onClick={() => setActiveTab('groups')}>Группы</TabsTrigger>
            <TabsTrigger value="channels" onClick={() => setActiveTab('channels')}>Каналы</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all hover:bg-muted/50 mb-1 ${
                    selectedChat?.id === chat.id ? 'glass-dark' : ''
                  }`}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback className="gradient-secondary text-white font-semibold">
                        {chat.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-card" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                        {chat.type !== 'personal' && (
                          <Icon name={getChatIcon(chat.type)} size={14} className="text-muted-foreground" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <Badge className="gradient-primary text-white rounded-full px-2 min-w-[20px] h-5 flex items-center justify-center text-xs">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Tabs>
      </div>

      <div className="flex-1 flex flex-col bg-muted/20">
        {selectedChat ? (
          <>
            <div className="glass border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback className="gradient-secondary text-white font-semibold">
                    {selectedChat.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedChat.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedChat.online ? 'в сети' : 'был(а) недавно'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10">
                  <Icon name="Phone" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10">
                  <Icon name="Video" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10">
                  <Icon name="Search" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10">
                  <Icon name="MoreVertical" size={20} />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sent ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[70%] rounded-3xl px-5 py-3 ${
                        message.sent
                          ? 'gradient-primary text-white rounded-br-md'
                          : 'bg-card border border-border rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                        message.sent ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        <span>{message.time}</span>
                        {message.sent && (
                          <Icon name={message.read ? 'CheckCheck' : 'Check'} size={14} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="glass border-t border-border p-4">
              <div className="flex items-center gap-3 max-w-4xl mx-auto">
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 shrink-0">
                  <Icon name="Smile" size={22} />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 shrink-0">
                  <Icon name="Paperclip" size={22} />
                </Button>
                
                <Input
                  placeholder="Введите сообщение..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 rounded-full border-2 focus:border-primary transition-all"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && messageText.trim()) {
                      setMessageText('');
                    }
                  }}
                />
                
                {messageText.trim() ? (
                  <Button size="icon" className="rounded-full gradient-primary text-white hover:opacity-90 shrink-0">
                    <Icon name="Send" size={20} />
                  </Button>
                ) : (
                  <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 shrink-0">
                    <Icon name="Mic" size={22} />
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 animate-scale-in">
              <div className="w-32 h-32 mx-auto gradient-primary rounded-full flex items-center justify-center">
                <Icon name="MessageCircle" size={64} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold">Выберите чат</h2>
              <p className="text-muted-foreground max-w-md">
                Начните общение с друзьями, коллегами или подпишитесь на интересные каналы
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;