import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Auth } from '@/components/Auth';
import { Settings } from '@/components/Settings';
import { Calls } from '@/components/Calls';
import { Bots } from '@/components/Bots';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/lib/theme-provider';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  type: 'personal' | 'group' | 'channel';
  pinned?: boolean;
  typing?: boolean;
}

interface Message {
  id: number;
  text: string;
  time: string;
  sent: boolean;
  read: boolean;
  edited?: boolean;
  forwarded?: boolean;
  replyTo?: number;
  attachments?: Array<{ type: 'image' | 'file' | 'voice'; url: string; name?: string }>;
}

interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  online: boolean;
  lastSeen?: string;
}

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; isPremium: boolean } | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('chats');
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showNewChannel, setShowNewChannel] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  
  const isDarkMode = theme === 'dark';
  
  const [chats, setChats] = useState<Chat[]>([
    { id: 1, name: 'Алексей Смирнов', avatar: '', lastMessage: 'Отлично, встречаемся завтра!', time: '14:32', unread: 2, online: true, type: 'personal', pinned: true },
    { id: 2, name: 'Команда Разработки', avatar: '', lastMessage: 'Релиз запланирован на пятницу', time: '13:15', unread: 5, online: false, type: 'group', pinned: false },
    { id: 3, name: 'Мария Иванова', avatar: '', lastMessage: 'Спасибо за помощь! 🙏', time: '12:48', unread: 0, online: true, type: 'personal', typing: false },
    { id: 4, name: 'Tech News', avatar: '', lastMessage: 'Новые технологии ИИ в 2026', time: '11:20', unread: 0, online: false, type: 'channel' },
    { id: 5, name: 'Дизайн Комьюнити', avatar: '', lastMessage: 'Кто-нибудь работал с Figma?', time: 'вчера', unread: 12, online: false, type: 'group' },
    { id: 6, name: 'Сохраненные сообщения', avatar: '', lastMessage: 'Важная заметка', time: 'вчера', unread: 0, online: false, type: 'personal', pinned: true },
  ]);

  const [allUsers, setAllUsers] = useState<User[]>([
    { id: 101, name: 'Дмитрий Петров', username: '@dmitry_p', avatar: '', bio: 'Frontend разработчик', online: true },
    { id: 102, name: 'Анна Соколова', username: '@anna_s', avatar: '', bio: 'UX/UI дизайнер', online: false, lastSeen: '2 часа назад' },
    { id: 103, name: 'Игорь Волков', username: '@igor_v', avatar: '', bio: 'Backend разработчик', online: true },
    { id: 104, name: 'Елена Морозова', username: '@elena_m', avatar: '', bio: 'Product Manager', online: false, lastSeen: 'вчера' },
    { id: 105, name: 'Сергей Новиков', username: '@sergey_n', avatar: '', bio: 'DevOps инженер', online: true },
  ]);

  const [chatMessages, setChatMessages] = useState<Record<number, Message[]>>({
    1: [
      { id: 1, text: 'Привет! Как дела?', time: '14:20', sent: false, read: true },
      { id: 2, text: 'Здорово! Работаю над новым проектом', time: '14:25', sent: true, read: true },
      { id: 3, text: 'Интересно! Расскажешь подробнее?', time: '14:28', sent: false, read: true },
      { id: 4, text: 'Да, конечно! Создаю мессенджер с ИИ', time: '14:30', sent: true, read: true, edited: true },
      { id: 5, text: 'Отлично, встречаемся завтра!', time: '14:32', sent: false, read: true },
    ],
    2: [
      { id: 1, text: 'Всем привет! Как продвигается проект?', time: '12:00', sent: false, read: true },
      { id: 2, text: 'Отлично! Уже на финальной стадии', time: '12:30', sent: true, read: true },
      { id: 3, text: 'Релиз запланирован на пятницу', time: '13:15', sent: false, read: true },
    ],
    3: [
      { id: 1, text: 'Можешь помочь с задачей?', time: '12:30', sent: false, read: true },
      { id: 2, text: 'Конечно! Что нужно?', time: '12:35', sent: true, read: true },
      { id: 3, text: 'Спасибо за помощь! 🙏', time: '12:48', sent: false, read: true },
    ],
    4: [
      { id: 1, text: 'Новые технологии ИИ в 2026', time: '11:20', sent: false, read: true },
    ],
    5: [
      { id: 1, text: 'Кто-нибудь работал с Figma?', time: 'вчера', sent: false, read: true },
    ],
    6: [
      { id: 1, text: 'Важная заметка для себя', time: 'вчера', sent: true, read: true },
    ],
  });

  const messages: Message[] = selectedChat ? (chatMessages[selectedChat.id] || []) : [];
  
  const filteredChats = chats
    .filter(chat => {
      const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterTab === 'chats' || 
                            (filterTab === 'groups' && chat.type === 'group') ||
                            (filterTab === 'channels' && chat.type === 'channel');
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.bio?.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const sendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;
    
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (editingMessage) {
      setChatMessages(prev => ({
        ...prev,
        [selectedChat.id]: prev[selectedChat.id].map(msg => 
          msg.id === editingMessage.id 
            ? { ...msg, text: messageText, edited: true }
            : msg
        )
      }));
      setEditingMessage(null);
    } else {
      const newMessage: Message = {
        id: (chatMessages[selectedChat.id]?.length || 0) + 1,
        text: messageText,
        time: time,
        sent: true,
        read: false,
        replyTo: replyingTo?.id,
      };
      
      setChatMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
      }));
      
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, lastMessage: messageText, time: time }
          : chat
      ));
      setReplyingTo(null);
    }
    
    setMessageText('');
  };

  const deleteMessage = (messageId: number) => {
    if (!selectedChat) return;
    setChatMessages(prev => ({
      ...prev,
      [selectedChat.id]: prev[selectedChat.id].filter(msg => msg.id !== messageId)
    }));
  };

  const forwardMessage = (message: Message) => {
    console.log('Forwarding message:', message);
  };

  const pinChat = (chatId: number) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, pinned: !chat.pinned } : chat
    ));
  };

  const muteChat = (chatId: number) => {
    console.log('Muting chat:', chatId);
  };

  const deleteChat = (chatId: number) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (selectedChat?.id === chatId) {
      setSelectedChat(null);
    }
  };

  const getChatIcon = (type: string) => {
    switch(type) {
      case 'group': return 'Users';
      case 'channel': return 'Radio';
      default: return 'User';
    }
  };
  
  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    if (chat.unread > 0) {
      setChats(prev => prev.map(c => 
        c.id === chat.id ? { ...c, unread: 0 } : c
      ));
    }
  };

  const handleLogin = (name: string, email: string) => {
    setUser({ name, email, isPremium: false });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setSelectedChat(null);
    setActiveTab('chats');
  };

  const handleUpgradePremium = () => {
    if (user) {
      setUser({ ...user, isPremium: true });
    }
  };

  const startChatWithUser = (selectedUser: User) => {
    const existingChat = chats.find(chat => chat.name === selectedUser.name);
    if (existingChat) {
      handleChatSelect(existingChat);
    } else {
      const newChat: Chat = {
        id: Date.now(),
        name: selectedUser.name,
        avatar: selectedUser.avatar,
        lastMessage: '',
        time: 'сейчас',
        unread: 0,
        online: selectedUser.online,
        type: 'personal',
      };
      setChats(prev => [newChat, ...prev]);
      setChatMessages(prev => ({ ...prev, [newChat.id]: [] }));
      handleChatSelect(newChat);
    }
    setShowUserSearch(false);
  };

  useEffect(() => {
    if (selectedChat?.typing) {
      const timeout = setTimeout(() => {
        setChats(prev => prev.map(chat => 
          chat.id === selectedChat.id ? { ...chat, typing: false } : chat
        ));
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [selectedChat?.typing]);

  if (!isAuthenticated || !user) {
    return <Auth onLogin={handleLogin} />;
  }

  if (activeTab === 'settings') {
    return (
      <Settings 
        user={user} 
        onBack={() => setActiveTab('chats')} 
        onLogout={handleLogout}
        onUpgradePremium={handleUpgradePremium}
      />
    );
  }

  if (activeTab === 'calls') {
    return <Calls onBack={() => setActiveTab('chats')} />;
  }

  if (activeTab === 'bots') {
    return <Bots onBack={() => setActiveTab('chats')} />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-20 gradient-primary flex-col items-center py-6 space-y-6">
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
        
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 rounded-2xl w-14 h-14"
          onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
        >
          <Icon name={isDarkMode ? "Sun" : "Moon"} size={24} />
        </Button>
        
        <Avatar 
          className="w-12 h-12 ring-2 ring-white/30 cursor-pointer hover:ring-white/50 transition-all"
          onClick={() => setActiveTab('settings')}
        >
          <AvatarImage src="" />
          <AvatarFallback className="gradient-accent text-white font-semibold">
            {user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Chat List */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-96 border-r border-border bg-card flex-col`}>
        <div className="p-3 md:p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="flex items-center gap-2">
              <Button 
                size="icon" 
                variant="ghost" 
                className="md:hidden rounded-full"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Icon name="Menu" size={20} />
              </Button>
              <h2 className="text-xl md:text-2xl font-bold">Чаты</h2>
            </div>
            <div className="flex gap-1 md:gap-2">
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full hover:gradient-primary hover:text-white transition-all h-9 w-9 md:h-10 md:w-10 md:hidden"
                onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                title={isDarkMode ? 'Светлая тема' : 'Темная тема'}
              >
                <Icon name={isDarkMode ? "Sun" : "Moon"} size={18} />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full hover:gradient-primary hover:text-white transition-all h-9 w-9 md:h-10 md:w-10"
                onClick={() => setShowUserSearch(true)}
              >
                <Icon name="UserPlus" size={18} />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full hover:gradient-primary hover:text-white transition-all h-9 w-9 md:h-10 md:w-10"
                onClick={() => setShowNewGroup(true)}
              >
                <Icon name="Users" size={18} />
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Поиск..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-2 focus:border-primary transition-all text-sm md:text-base"
            />
          </div>
        </div>

        <Tabs value={filterTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-2 md:mx-4 mt-2 grid grid-cols-3 bg-muted/50">
            <TabsTrigger value="chats" onClick={() => setFilterTab('chats')} className="text-xs md:text-sm">Все</TabsTrigger>
            <TabsTrigger value="groups" onClick={() => setFilterTab('groups')} className="text-xs md:text-sm">Группы</TabsTrigger>
            <TabsTrigger value="channels" onClick={() => setFilterTab('channels')} className="text-xs md:text-sm">Каналы</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <div className="p-1 md:p-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                  }}
                  className={`group flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl md:rounded-2xl cursor-pointer transition-all hover:bg-muted/50 mb-1 ${
                    selectedChat?.id === chat.id ? 'glass-dark' : ''
                  } relative`}
                >
                  <div className="relative shrink-0">
                    <Avatar className="w-10 h-10 md:w-12 md:h-12">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback className="gradient-secondary text-white font-semibold text-sm md:text-base">
                        {chat.name === 'Сохраненные сообщения' ? '📌' : chat.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {chat.online && chat.type === 'personal' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-card" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5 md:mb-1">
                      <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-1">
                        <h3 className="font-semibold text-xs md:text-sm truncate">{chat.name}</h3>
                        {chat.type !== 'personal' && (
                          <Icon name={getChatIcon(chat.type)} size={12} className="text-muted-foreground shrink-0" />
                        )}
                        {chat.pinned && (
                          <Icon name="Pin" size={12} className="text-primary shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] md:text-xs text-muted-foreground ml-2 shrink-0">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs md:text-sm text-muted-foreground truncate">
                        {chat.typing ? (
                          <span className="text-primary flex items-center gap-1">
                            <Icon name="Pencil" size={12} />
                            печатает...
                          </span>
                        ) : (
                          chat.lastMessage
                        )}
                      </p>
                      {chat.unread > 0 && (
                        <Badge className="gradient-primary text-white rounded-full px-1.5 md:px-2 min-w-[18px] md:min-w-[20px] h-4 md:h-5 flex items-center justify-center text-[10px] md:text-xs ml-2 shrink-0">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="hidden group-hover:flex items-center gap-1 absolute right-2 bg-card/95 px-2 py-1 rounded-lg">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        pinChat(chat.id);
                      }}
                    >
                      <Icon name={chat.pinned ? "PinOff" : "Pin"} size={14} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        muteChat(chat.id);
                      }}
                    >
                      <Icon name="BellOff" size={14} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Tabs>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden border-t border-border p-2 grid grid-cols-4 gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 ${activeTab === 'chats' ? 'text-primary' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            <Icon name="MessageSquare" size={20} />
            <span className="text-[10px]">Чаты</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 ${activeTab === 'calls' ? 'text-primary' : ''}`}
            onClick={() => setActiveTab('calls')}
          >
            <Icon name="Phone" size={20} />
            <span className="text-[10px]">Звонки</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 ${activeTab === 'bots' ? 'text-primary' : ''}`}
            onClick={() => setActiveTab('bots')}
          >
            <Icon name="Bot" size={20} />
            <span className="text-[10px]">Боты</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 ${activeTab === 'settings' ? 'text-primary' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Icon name="Settings" size={20} />
            <span className="text-[10px]">Еще</span>
          </Button>
        </div>
      </div>

      {/* Chat Window */}
      <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-muted/20 min-w-0`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="glass border-b border-border p-3 md:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="md:hidden rounded-full shrink-0 h-9 w-9"
                  onClick={() => setSelectedChat(null)}
                >
                  <Icon name="ArrowLeft" size={20} />
                </Button>
                <Avatar className="w-9 h-9 md:w-10 md:h-10 cursor-pointer shrink-0" onClick={() => setShowChatInfo(true)}>
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback className="gradient-secondary text-white font-semibold text-sm">
                    {selectedChat.name === 'Сохраненные сообщения' ? '📌' : selectedChat.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setShowChatInfo(true)}>
                  <h3 className="font-semibold text-sm md:text-base truncate">{selectedChat.name}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                    {selectedChat.typing ? (
                      <span className="text-primary">печатает...</span>
                    ) : selectedChat.online ? (
                      'в сети'
                    ) : (
                      'был(а) недавно'
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 md:gap-2 shrink-0">
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 h-8 w-8 md:h-10 md:w-10">
                  <Icon name="Phone" size={16} className="md:w-5 md:h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 h-8 w-8 md:h-10 md:w-10">
                  <Icon name="Video" size={16} className="md:w-5 md:h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 h-8 w-8 md:h-10 md:w-10">
                  <Icon name="Search" size={16} className="md:w-5 md:h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 h-8 w-8 md:h-10 md:w-10">
                  <Icon name="MoreVertical" size={16} className="md:w-5 md:h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3 md:p-6">
              <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sent ? 'justify-end' : 'justify-start'} animate-fade-in group`}
                  >
                    <div className="relative">
                      <div
                        className={`max-w-[85vw] md:max-w-[70%] rounded-2xl md:rounded-3xl px-3 py-2 md:px-5 md:py-3 ${
                          message.sent
                            ? 'gradient-primary text-white rounded-br-md'
                            : 'bg-card border border-border rounded-bl-md'
                        }`}
                        onContextMenu={(e) => {
                          e.preventDefault();
                        }}
                      >
                        {message.replyTo && (
                          <div className="mb-2 pb-2 border-b border-white/20 text-xs opacity-70">
                            <Icon name="CornerDownRight" size={12} className="inline mr-1" />
                            Ответ на сообщение
                          </div>
                        )}
                        <p className="text-xs md:text-sm leading-relaxed break-words">{message.text}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] md:text-xs ${
                          message.sent ? 'text-white/70' : 'text-muted-foreground'
                        }`}>
                          {message.edited && <span>изм.</span>}
                          <span>{message.time}</span>
                          {message.sent && (
                            <Icon name={message.read ? 'CheckCheck' : 'Check'} size={12} className="md:w-3.5 md:h-3.5" />
                          )}
                        </div>
                      </div>

                      <div className="hidden group-hover:flex items-center gap-1 absolute -top-8 right-0 bg-card/95 px-2 py-1 rounded-lg shadow-lg">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => setReplyingTo(message)}
                        >
                          <Icon name="Reply" size={14} />
                        </Button>
                        {message.sent && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => {
                              setEditingMessage(message);
                              setMessageText(message.text);
                            }}
                          >
                            <Icon name="Pencil" size={14} />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => forwardMessage(message)}
                        >
                          <Icon name="Forward" size={14} />
                        </Button>
                        {message.sent && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-red-500"
                            onClick={() => deleteMessage(message.id)}
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="glass border-t border-border p-2 md:p-4">
              {(replyingTo || editingMessage) && (
                <div className="mb-2 p-2 bg-muted/50 rounded-lg flex items-center justify-between text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <Icon name={editingMessage ? "Pencil" : "Reply"} size={14} />
                    <span>
                      {editingMessage ? 'Редактирование' : 'Ответ на'}:{' '}
                      {(editingMessage || replyingTo)?.text.slice(0, 50)}...
                    </span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => {
                      setReplyingTo(null);
                      setEditingMessage(null);
                      setMessageText('');
                    }}
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </div>
              )}
              <div className="flex items-end gap-2 md:gap-3 max-w-4xl mx-auto">
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 shrink-0 h-8 w-8 md:h-10 md:w-10">
                  <Icon name="Smile" size={18} className="md:w-5 md:h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 shrink-0 h-8 w-8 md:h-10 md:w-10">
                  <Icon name="Paperclip" size={18} className="md:w-5 md:h-5" />
                </Button>
                
                <Textarea
                  placeholder="Введите сообщение..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 min-h-[36px] md:min-h-[44px] max-h-32 rounded-2xl border-2 focus:border-primary transition-all resize-none text-xs md:text-sm py-2 md:py-2.5"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && messageText.trim()) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                
                {messageText.trim() ? (
                  <Button size="icon" onClick={sendMessage} className="rounded-full gradient-primary text-white hover:opacity-90 shrink-0 h-8 w-8 md:h-10 md:w-10">
                    <Icon name="Send" size={16} className="md:w-5 md:h-5" />
                  </Button>
                ) : (
                  <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 shrink-0 h-8 w-8 md:h-10 md:w-10">
                    <Icon name="Mic" size={18} className="md:w-5 md:h-5" />
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center space-y-4 animate-scale-in">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto gradient-primary rounded-full flex items-center justify-center">
                <Icon name="MessageCircle" size={48} className="text-white md:w-16 md:h-16" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold">Выберите чат</h2>
              <p className="text-muted-foreground max-w-md text-sm md:text-base">
                Начните общение с друзьями, коллегами или подпишитесь на интересные каналы
              </p>
            </div>
          </div>
        )}
      </div>

      {/* User Search Dialog */}
      <Dialog open={showUserSearch} onOpenChange={setShowUserSearch}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] p-0">
          <DialogHeader className="p-4 md:p-6 pb-4">
            <DialogTitle className="text-xl md:text-2xl">Найти пользователей</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Найдите друзей и коллег для общения
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-4 md:px-6">
            <div className="relative">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Имя, @username или bio..." 
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="pl-10 rounded-full border-2 focus:border-primary text-sm md:text-base"
              />
            </div>
          </div>

          <ScrollArea className="max-h-[400px] px-4 md:px-6 pb-4 md:pb-6">
            <div className="space-y-2 pt-4">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => startChatWithUser(u)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-all"
                >
                  <Avatar className="w-12 h-12 md:w-14 md:h-14">
                    <AvatarImage src={u.avatar} />
                    <AvatarFallback className="gradient-secondary text-white font-semibold">
                      {u.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate text-sm md:text-base">{u.name}</h3>
                      {u.online && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{u.username}</p>
                    {u.bio && <p className="text-xs text-muted-foreground truncate">{u.bio}</p>}
                    {!u.online && u.lastSeen && (
                      <p className="text-xs text-muted-foreground">был(а) {u.lastSeen}</p>
                    )}
                  </div>
                  <Icon name="MessageCircle" size={20} className="text-primary" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Chat Info Sheet */}
      <Sheet open={showChatInfo} onOpenChange={setShowChatInfo}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Информация</SheetTitle>
          </SheetHeader>
          {selectedChat && (
            <div className="mt-6 space-y-6">
              <div className="text-center space-y-3">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback className="gradient-secondary text-white text-3xl font-bold">
                    {selectedChat.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{selectedChat.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedChat.online ? 'в сети' : 'был(а) недавно'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <Icon name="Phone" size={16} className="mr-2" />
                  Позвонить
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <Icon name="Video" size={16} className="mr-2" />
                  Видеозвонок
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <Icon name="Search" size={16} className="mr-2" />
                  Поиск по сообщениям
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <Icon name={selectedChat.pinned ? "PinOff" : "Pin"} size={16} className="mr-2" />
                  {selectedChat.pinned ? 'Открепить' : 'Закрепить'}
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <Icon name="BellOff" size={16} className="mr-2" />
                  Выключить уведомления
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl text-red-500">
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Удалить чат
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Mobile Menu Drawer */}
      <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Меню</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Avatar className="w-12 h-12">
                <AvatarImage src="" />
                <AvatarFallback className="gradient-accent text-white font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl"
              onClick={() => {
                setShowUserSearch(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <Icon name="UserPlus" size={18} className="mr-2" />
              Найти пользователей
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl"
              onClick={() => {
                setShowNewGroup(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <Icon name="Users" size={18} className="mr-2" />
              Создать группу
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl"
              onClick={() => {
                setShowNewChannel(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <Icon name="Radio" size={18} className="mr-2" />
              Создать канал
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl"
              onClick={() => {
                setActiveTab('settings');
                setIsMobileMenuOpen(false);
              }}
            >
              <Icon name="Settings" size={18} className="mr-2" />
              Настройки
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-between rounded-xl"
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
            >
              <span className="flex items-center">
                <Icon name={isDarkMode ? "Moon" : "Sun"} size={18} className="mr-2" />
                {isDarkMode ? 'Темная тема' : 'Светлая тема'}
              </span>
              <Icon name={isDarkMode ? "Sun" : "Moon"} size={16} className="text-muted-foreground" />
            </Button>
            {user.isPremium && (
              <div className="p-3 rounded-xl gradient-primary text-white text-center">
                <Icon name="Crown" size={24} className="mx-auto mb-2" />
                <p className="font-semibold">Premium активен</p>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* New Group Dialog */}
      <Dialog open={showNewGroup} onOpenChange={setShowNewGroup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новая группа</DialogTitle>
            <DialogDescription>
              Создайте группу для общения с несколькими людьми
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Название группы" className="rounded-xl" />
            <Textarea placeholder="Описание (необязательно)" className="rounded-xl" />
            <Button className="w-full gradient-primary text-white rounded-xl">
              Создать группу
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Channel Dialog */}
      <Dialog open={showNewChannel} onOpenChange={setShowNewChannel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новый канал</DialogTitle>
            <DialogDescription>
              Создайте канал для рассылки сообщений подписчикам
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Название канала" className="rounded-xl" />
            <Textarea placeholder="Описание канала" className="rounded-xl" />
            <Button className="w-full gradient-primary text-white rounded-xl">
              Создать канал
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;