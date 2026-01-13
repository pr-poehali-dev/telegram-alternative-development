import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Call {
  id: number;
  name: string;
  avatar: string;
  type: 'incoming' | 'outgoing' | 'missed';
  callType: 'voice' | 'video';
  time: string;
  duration?: string;
}

interface CallsProps {
  onBack: () => void;
}

export const Calls = ({ onBack }: CallsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeCall, setActiveCall] = useState<Call | null>(null);

  const calls: Call[] = [
    { id: 1, name: 'Алексей Смирнов', avatar: '', type: 'incoming', callType: 'video', time: '14:32', duration: '12:34' },
    { id: 2, name: 'Мария Иванова', avatar: '', type: 'outgoing', callType: 'voice', time: '12:48', duration: '5:12' },
    { id: 3, name: 'Команда Разработки', avatar: '', type: 'missed', callType: 'video', time: 'вчера', duration: undefined },
    { id: 4, name: 'Дмитрий Петров', avatar: '', type: 'outgoing', callType: 'voice', time: 'вчера', duration: '23:45' },
    { id: 5, name: 'Анна Соколова', avatar: '', type: 'incoming', callType: 'video', time: '2 дня назад', duration: '8:20' },
  ];

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'missed' && call.type === 'missed');
    return matchesSearch && matchesTab;
  });

  const getCallIcon = (type: 'incoming' | 'outgoing' | 'missed') => {
    switch(type) {
      case 'incoming': return 'PhoneIncoming';
      case 'outgoing': return 'PhoneOutgoing';
      case 'missed': return 'PhoneMissed';
    }
  };

  const getCallColor = (type: 'incoming' | 'outgoing' | 'missed') => {
    switch(type) {
      case 'incoming': return 'text-green-500';
      case 'outgoing': return 'text-blue-500';
      case 'missed': return 'text-red-500';
    }
  };

  const startCall = (call: Call, isVideo: boolean) => {
    setActiveCall({ ...call, callType: isVideo ? 'video' : 'voice' });
  };

  const endCall = () => {
    setActiveCall(null);
  };

  if (activeCall) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 items-center justify-center">
        <div className="text-center space-y-8 animate-fade-in">
          <Avatar className="w-40 h-40 mx-auto ring-8 ring-white/30">
            <AvatarImage src={activeCall.avatar} />
            <AvatarFallback className="gradient-secondary text-white text-5xl font-bold">
              {activeCall.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-white">{activeCall.name}</h2>
            <p className="text-xl text-white/80">
              {activeCall.callType === 'video' ? 'Видеозвонок' : 'Голосовой вызов'}
            </p>
            <p className="text-lg text-white/60">00:00</p>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Button
              size="icon"
              variant="ghost"
              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white"
            >
              <Icon name="Mic" size={28} />
            </Button>
            
            {activeCall.callType === 'video' && (
              <Button
                size="icon"
                variant="ghost"
                className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <Icon name="Video" size={28} />
              </Button>
            )}
            
            <Button
              size="icon"
              onClick={endCall}
              className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white"
            >
              <Icon name="PhoneOff" size={32} />
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white"
            >
              <Icon name="Volume2" size={28} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="w-full max-w-4xl mx-auto flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="rounded-full"
              >
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <h1 className="text-2xl font-bold">Звонки</h1>
            </div>
            <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10">
              <Icon name="Plus" size={20} />
            </Button>
          </div>
          
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Поиск контактов..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-2 focus:border-primary transition-all"
            />
          </div>
        </div>

        <Tabs value={activeTab} className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-2 grid grid-cols-2 bg-muted/50">
            <TabsTrigger value="all" onClick={() => setActiveTab('all')}>Все</TabsTrigger>
            <TabsTrigger value="missed" onClick={() => setActiveTab('missed')}>Пропущенные</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {filteredCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-all"
                >
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={call.avatar} />
                    <AvatarFallback className="gradient-secondary text-white font-semibold">
                      {call.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{call.name}</h3>
                      <Icon 
                        name={call.callType === 'video' ? 'Video' : 'Phone'} 
                        size={14} 
                        className="text-muted-foreground" 
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon 
                        name={getCallIcon(call.type)} 
                        size={14} 
                        className={getCallColor(call.type)} 
                      />
                      <span>{call.time}</span>
                      {call.duration && <span>• {call.duration}</span>}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => startCall(call, false)}
                      className="rounded-full hover:bg-green-500/10 text-green-500"
                    >
                      <Icon name="Phone" size={20} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => startCall(call, true)}
                      className="rounded-full hover:bg-blue-500/10 text-blue-500"
                    >
                      <Icon name="Video" size={20} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};
