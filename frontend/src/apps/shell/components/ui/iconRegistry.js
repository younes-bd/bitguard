import { 
    Settings, Building2, Globe, Layers, Layout, Database, Clock, Terminal, 
    Upload, Download, DollarSign, Key, ShieldCheck, Users, AlertCircle, 
    FileText, ShoppingBag, Server, PieChart, Paintbrush, Tags, Box, 
    ShoppingCart, Truck, Activity, Puzzle, RefreshCw, Megaphone, LifeBuoy, 
    Bell, CreditCard, BarChart3, FolderKanban, TrendingUp, BookOpen, Monitor, 
    Cpu, Wrench, Tag, Plus, FolderOpen, CheckSquare, GitBranch, Award, 
    Repeat, Landmark, FileSpreadsheet, Scale, Image, Inbox, UserPlus, 
    TrendingDown, FileCheck, Calendar, Edit3, Share2, MessageSquare, Sparkles, 
    PenTool, Palette, Send, Video, Smartphone, Zap, Printer, User, Trash2, 
    Grid, Home, Target, Compass, MessageCircle, FileQuestion, Book, PhoneCall, 
    CheckCircle, MapPin, Utensils, Leaf, UserCheck, Star, AtSign, Webhook 
} from 'lucide-react';

export const IconRegistry = {
    Settings, Building2, Globe, Layers, Layout, Database, Clock, Terminal, 
    Upload, Download, DollarSign, Key, ShieldCheck, Users, AlertCircle, 
    FileText, ShoppingBag, Server, PieChart, Paintbrush, Tags, Box, 
    ShoppingCart, Truck, Activity, Puzzle, RefreshCw, Megaphone, LifeBuoy, 
    Bell, CreditCard, BarChart3, FolderKanban, TrendingUp, BookOpen, Monitor, 
    Cpu, Wrench, Tag, Plus, FolderOpen, CheckSquare, GitBranch, Award, 
    Repeat, Landmark, FileSpreadsheet, Scale, Image, Inbox, UserPlus, 
    TrendingDown, FileCheck, Calendar, Edit3, Share2, MessageSquare, Sparkles, 
    PenTool, Palette, Send, Video, Smartphone, Zap, Printer, User, Trash2, 
    Grid, Home, Target, Compass, MessageCircle, FileQuestion, Book, PhoneCall, 
    CheckCircle, MapPin, Utensils, Leaf, UserCheck, Star, AtSign, Webhook 
};

export const getIcon = (iconName, DefaultIcon = Settings) => {
    return IconRegistry[iconName] || DefaultIcon;
};
