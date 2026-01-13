import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface VideoCallProps {
  participant: {
    name: string;
    avatar: string;
  };
  onEnd: () => void;
}

export const VideoCall = ({ participant, onEnd }: VideoCallProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="relative flex h-screen bg-black overflow-hidden"
      onMouseMove={() => setShowControls(true)}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {isScreenSharing ? (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-white/10 rounded-3xl flex items-center justify-center">
                <Icon name="Monitor" size={64} className="text-white" />
              </div>
              <p className="text-white text-xl">Демонстрация экрана активна</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full gradient-secondary flex items-center justify-center">
            {isVideoOff ? (
              <div className="text-center space-y-6">
                <Avatar className="w-48 h-48 mx-auto ring-8 ring-white/30">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback className="gradient-primary text-white text-6xl font-bold">
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-4xl font-bold text-white">{participant.name}</h2>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Avatar className="w-48 h-48 ring-8 ring-white/30">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback className="gradient-accent text-white text-6xl font-bold">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute top-6 right-6 w-64 h-48 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/30 animate-fade-in">
        {isVideoOff ? (
          <div className="w-full h-full gradient-primary flex items-center justify-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src="" />
              <AvatarFallback className="gradient-accent text-white text-3xl font-bold">
                ВЫ
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="w-full h-full gradient-accent flex items-center justify-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src="" />
              <AvatarFallback className="bg-white text-primary text-3xl font-bold">
                ВЫ
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>

      <div
        className={`absolute top-6 left-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="glass text-white px-6 py-3 rounded-full flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="font-semibold text-lg">{formatDuration(duration)}</span>
        </div>
      </div>

      <div
        className={`absolute top-20 left-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="space-y-2">
          <Badge className="glass text-white border-white/30 px-4 py-2 text-sm">
            <Icon name="Signal" size={14} className="mr-2" />
            Отличное соединение
          </Badge>
          {isScreenSharing && (
            <Badge className="bg-blue-500 text-white px-4 py-2 text-sm">
              <Icon name="Monitor" size={14} className="mr-2" />
              Демонстрация экрана
            </Badge>
          )}
        </div>
      </div>

      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="glass px-6 py-4 rounded-full flex items-center gap-4">
          <Button
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full ${
              isMuted 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <Icon name={isMuted ? 'MicOff' : 'Mic'} size={24} />
          </Button>

          <Button
            size="icon"
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-14 h-14 rounded-full ${
              isVideoOff 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <Icon name={isVideoOff ? 'VideoOff' : 'Video'} size={24} />
          </Button>

          <Button
            size="icon"
            onClick={onEnd}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white mx-2"
          >
            <Icon name="PhoneOff" size={28} />
          </Button>

          <Button
            size="icon"
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`w-14 h-14 rounded-full ${
              isScreenSharing 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <Icon name="Monitor" size={24} />
          </Button>

          <Button
            size="icon"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-14 h-14 rounded-full ${
              !isSpeakerOn 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <Icon name={isSpeakerOn ? 'Volume2' : 'VolumeX'} size={24} />
          </Button>

          <Button
            size="icon"
            className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <Icon name="MoreVertical" size={24} />
          </Button>
        </div>
      </div>

      <div
        className={`absolute bottom-32 right-6 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex flex-col gap-3">
          <Button
            size="icon"
            className="w-14 h-14 rounded-full glass text-white hover:bg-white/30"
          >
            <Icon name="MessageSquare" size={24} />
          </Button>
          
          <Button
            size="icon"
            className="w-14 h-14 rounded-full glass text-white hover:bg-white/30"
          >
            <Icon name="Users" size={24} />
          </Button>
          
          <Button
            size="icon"
            className="w-14 h-14 rounded-full glass text-white hover:bg-white/30"
          >
            <Icon name="Grid3x3" size={24} />
          </Button>
        </div>
      </div>

      {isMuted && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="glass text-white px-8 py-4 rounded-3xl flex items-center gap-3 animate-fade-in">
            <Icon name="MicOff" size={24} className="text-red-400" />
            <span className="text-lg font-semibold">Вы на миуте</span>
          </div>
        </div>
      )}
    </div>
  );
};
