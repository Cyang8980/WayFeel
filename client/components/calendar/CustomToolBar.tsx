import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigateAction } from 'react-big-calendar';
import { Google } from '@mui/icons-material';

interface CustomToolbarProps {
    date: Date;
    onNavigate: (action: NavigateAction) => void;
    onConnectGoogle: () => Promise<void>;
    googleConnected: boolean;
    emojis?: {
        src: string;
        alt: string;
    }[];
}

export const CustomToolBar: React.FC<CustomToolbarProps> = ({
    date,
    onNavigate,
    onConnectGoogle,
    googleConnected,
    emojis
}) => {
    const navigate = (action: NavigateAction) => {
        onNavigate(action);
    };

    const formatWeekRange = (currentDate: Date): string => {
        const start = new Date(currentDate);
        const end = new Date(currentDate);

        // Set to start of week (Sunday)
        const day = start.getDay();
        const diff = start.getDate() - day; // Always go to Sunday
        start.setDate(diff);
        end.setDate(diff + 6); // End on Saturday

        const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
        const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
        const year = start.getFullYear();

        if (startMonth === endMonth) {
            return `${startMonth} ${start.getDate()}-${end.getDate()}, ${year}`;
        } else {
            return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${year}`;
        }
    };

    return (
        <div className="flex justify-between items-center mb-4 min-h-[72px] bg-white rounded-lg shadow-sm px-6">
            <div className="flex items-center space-x-3">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('TODAY')}
                    className="text-base"
                >
                    Today
                </Button>
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => navigate('PREV')}
                        className="h-12 w-12"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <div className="mx-4 text-xl font-semibold min-w-[220px] text-center">
                        {formatWeekRange(date)}
                    </div>

                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => navigate('NEXT')}
                        className="h-12 w-12"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                {!googleConnected && (
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onConnectGoogle}
                        className="flex items-center space-x-1 px-4 py-2"
                    >
                        <Google className="h-5 w-5" />
                    </Button>
                )}
                
                {emojis && emojis.length > 0 && (
                    <div className="flex items-center gap-3 ml-4">
                        {emojis.map((emoji, index) => (
                            <img
                                key={index}
                                src={emoji.src}
                                alt={emoji.alt}
                                className="w-8 h-8 select-none hover:scale-110 transition-transform"
                                draggable="false"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};