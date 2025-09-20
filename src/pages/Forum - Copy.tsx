import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  MessageSquare, 
  Plus, 
  Heart, 
  MessageCircle,
  Volume2,
  Globe,
  Users,
  Lightbulb,
  Bug,
  Sprout,
  Mic,
  Share2,
  Bookmark,
  Flag,
  MoreHorizontal,
  Reply,
  Star,
  Camera,
  Phone,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Clock,
  TrendingUp,
  Award,
  Shield,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { forumApi } from "@/lib/forum-api";

const forumPosts = [
  {
    id: 1,
    title: "Best practices for wheat crop in March",
    content: "I've been farming wheat for 10 years and wanted to share some insights about planting in March conditions...",
    author: "Ramesh Kumar",
    authorId: "user1",
    category: "Crop Management",
    likes: 24,
    dislikes: 2,
    views: 156,
    timeAgo: "2 hours ago",
    hasVoiceNote: true,
    language: "Hindi",
    tags: ["wheat", "planting", "march"],
    isBookmarked: false,
    isLiked: false,
    isDisliked: false,
    authorReputation: 1250,
    isVerified: true,
    images: ["wheat-field.jpg"],
    whatsappGroupJoined: false,
    replies: [
      {
        id: 1,
        author: "Suresh Kumar",
        authorId: "user5",
        content: "Great insights! I've been following similar practices for wheat cultivation. The timing you mentioned is crucial for good yield.",
        timeAgo: "1 hour ago",
        likes: 5,
        isLiked: false,
        replies: []
      },
      {
        id: 2,
        author: "Priya Singh",
        authorId: "user6",
        content: "Thank you for sharing. This is very helpful. I'm planning to plant wheat next month and this timing advice is perfect.",
        timeAgo: "30 minutes ago",
        likes: 3,
        isLiked: true,
        replies: []
      },
      {
        id: 3,
        author: "Rajesh Verma",
        authorId: "user7",
        content: "I've been using this method for 3 years now. The results have been consistently good. Thanks for spreading the knowledge!",
        timeAgo: "15 minutes ago",
        likes: 2,
        isLiked: false,
        replies: []
      }
    ]
  },
  {
    id: 2,
    title: "Dealing with aphid infestation on cotton",
    content: "My cotton crop is showing signs of aphid damage. Has anyone tried organic solutions that actually work?",
    author: "Priya Patel",
    authorId: "user2",
    category: "Pest Control",
    likes: 16,
    dislikes: 1,
    views: 89,
    timeAgo: "5 hours ago",
    hasVoiceNote: false,
    language: "English",
    tags: ["cotton", "aphids", "organic", "pestcontrol"],
    isBookmarked: true,
    isLiked: false,
    isDisliked: false,
    authorReputation: 890,
    isVerified: false,
    images: ["cotton-aphids.jpg"],
    whatsappGroupJoined: true,
    replies: [
      {
        id: 4,
        author: "Rajesh Kumar",
        authorId: "user8",
        content: "Try neem oil spray, it works well for aphids. Mix 2ml neem oil with 1 liter water and spray every 3 days.",
        timeAgo: "4 hours ago",
        likes: 8,
        isLiked: false,
        replies: []
      },
      {
        id: 5,
        author: "Sunita Devi",
        authorId: "user9",
        content: "I've had success with garlic spray. Crush 10 garlic cloves, mix with water, let it sit overnight, then spray. It's completely organic.",
        timeAgo: "3 hours ago",
        likes: 6,
        isLiked: false,
        replies: []
      },
      {
        id: 6,
        author: "Vikram Singh",
        authorId: "user10",
        content: "Ladybugs are natural predators of aphids. You can buy them online or attract them with flowering plants near your cotton field.",
        timeAgo: "2 hours ago",
        likes: 4,
        isLiked: true,
        replies: []
      }
    ]
  },
  {
    id: 3,
    title: "Soil pH testing results and recommendations",
    content: "Just got my soil test results back. pH is 6.2. Looking for advice on lime application rates...",
    author: "Suresh Singh",
    authorId: "user3",
    category: "Soil Health",
    likes: 31,
    dislikes: 0,
    views: 203,
    timeAgo: "1 day ago",
    hasVoiceNote: true,
    language: "Bengali",
    tags: ["soil", "pH", "lime", "testing"],
    isBookmarked: false,
    isLiked: true,
    isDisliked: false,
    authorReputation: 2100,
    isVerified: true,
    images: ["soil-test.jpg", "ph-meter.jpg"],
    whatsappGroupJoined: false,
    replies: [
      {
        id: 7,
        author: "Dr. Anil Sharma",
        authorId: "user11",
        content: "pH 6.2 is good for most crops. For lime application, use 50kg per acre if pH is below 6.0. Your soil is already in good range.",
        timeAgo: "20 hours ago",
        likes: 12,
        isLiked: false,
        replies: []
      },
      {
        id: 8,
        author: "Meera Patel",
        authorId: "user12",
        content: "I had similar pH levels last year. Instead of lime, I used compost and saw great improvement in soil structure.",
        timeAgo: "18 hours ago",
        likes: 7,
        isLiked: true,
        replies: []
      }
    ]
  },
  {
    id: 4,
    title: "Water management during drought conditions",
    content: "With the current drought situation, I'm looking for effective water conservation techniques...",
    author: "Lakshmi Reddy",
    authorId: "user4",
    category: "Water Management",
    likes: 42,
    dislikes: 3,
    views: 312,
    timeAgo: "2 days ago",
    hasVoiceNote: false,
    language: "Telugu",
    tags: ["drought", "water", "conservation", "irrigation"],
    isBookmarked: true,
    isLiked: false,
    isDisliked: false,
    authorReputation: 1800,
    isVerified: true,
    images: ["drought-field.jpg"],
    whatsappGroupJoined: true,
    replies: [
      {
        id: 9,
        author: "Krishna Reddy",
        authorId: "user13",
        content: "Drip irrigation is the best solution for drought conditions. It saves 50% water compared to traditional methods.",
        timeAgo: "1 day ago",
        likes: 15,
        isLiked: false,
        replies: []
      },
      {
        id: 10,
        author: "Sarita Joshi",
        authorId: "user14",
        content: "Mulching with organic matter helps retain soil moisture. I use rice straw and it works wonders during dry spells.",
        timeAgo: "1 day ago",
        likes: 9,
        isLiked: true,
        replies: []
      },
      {
        id: 11,
        author: "Ravi Kumar",
        authorId: "user15",
        content: "Consider rainwater harvesting. Even small ponds can store enough water for critical irrigation periods.",
        timeAgo: "22 hours ago",
        likes: 6,
        isLiked: false,
        replies: []
      }
    ]
  }
];

const categories = [
  "Crop Management",
  "Pest Control", 
  "Soil Health",
  "Water Management",
  "Equipment",
  "Market Prices",
  "Government Schemes",
  "General Discussion"
];

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "bn", name: "বাংলা" },
  { code: "te", name: "తెలుగు" },
  { code: "ta", name: "தமிழ்" }
];

export default function Forum() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [posts, setPosts] = useState(forumPosts);

  // Fetch posts from API on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const apiPosts = await forumApi.getPosts();
        setPosts(apiPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        // Keep using mock data if API fails
      }
    };
    
    fetchPosts();
  }, []);

  // Refresh posts function
  const refreshPosts = async () => {
    try {
      const apiPosts = await forumApi.getPosts();
      setPosts(apiPosts);
      toast({
        title: "Posts Refreshed",
        description: "Latest posts loaded successfully!",
      });
    } catch (error) {
      console.error('Failed to refresh posts:', error);
      toast({
        title: "Refresh Failed",
        description: "Could not load latest posts",
        variant: "destructive"
      });
    }
  };
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    language: "en",
    hasVoiceNote: false,
    images: [] as string[]
  });
  const [replyData, setReplyData] = useState({
    content: "",
    postId: 0
  });
  const { toast } = useToast();

  const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/GlzOFe6jnvtKf6z0fnVoyk";

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filter === "all" || post.category === filter;
    const matchesLanguage = selectedLanguage === "all" || post.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  }).sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (b.likes - b.dislikes) - (a.likes - a.dislikes);
      case "replies":
        return b.replies.length - a.replies.length;
      case "views":
        return b.views - a.views;
      case "recent":
      default:
        return new Date(b.timeAgo).getTime() - new Date(a.timeAgo).getTime();
    }
  });

  const handleCreatePost = async () => {
    if (!formData.title || !formData.content || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Database call first
    try {
      const newPost = await forumApi.createPost({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        language: formData.language,
        hasVoiceNote: formData.hasVoiceNote,
        images: formData.images
      });
      
      // Add the post from API response to the UI
      setPosts([newPost, ...posts]);
    } catch (error) {
      console.error('Failed to create post:', error);
      toast({
        title: "Failed to Create Post",
        description: "Please try again later",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Post Created! 📝",
      description: "Your knowledge has been shared with the community",
      variant: "default"
    });

    setFormData({
      title: "",
      content: "",
      category: "",
      language: "en",
      hasVoiceNote: false,
      images: []
    });
    setIsCreateDialogOpen(false);
  };

  const handleLike = async (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newPost = { ...post };
        if (newPost.isLiked) {
          newPost.likes--;
          newPost.isLiked = false;
        } else {
          if (newPost.isDisliked) {
            newPost.dislikes--;
            newPost.isDisliked = false;
          }
          newPost.likes++;
          newPost.isLiked = true;
        }
        return newPost;
      }
      return post;
    }));

    // Database call
    try {
      await forumApi.updatePostLikes(postId, 'like');
    } catch (error) {
      console.error('Failed to update likes:', error);
      // Revert the UI change if API call fails
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const newPost = { ...post };
          if (newPost.isLiked) {
            newPost.likes--;
            newPost.isLiked = false;
          } else {
            if (newPost.isDisliked) {
              newPost.dislikes--;
              newPost.isDisliked = false;
            }
            newPost.likes++;
            newPost.isLiked = true;
          }
          return newPost;
        }
        return post;
      }));
    }

    toast({
      title: "Post Liked! ❤️",
      description: "Your appreciation has been recorded",
      variant: "default"
    });
  };

  const handleDislike = async (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newPost = { ...post };
        if (newPost.isDisliked) {
          newPost.dislikes--;
          newPost.isDisliked = false;
        } else {
          if (newPost.isLiked) {
            newPost.likes--;
            newPost.isLiked = false;
          }
          newPost.dislikes++;
          newPost.isDisliked = true;
        }
        return newPost;
      }
      return post;
    }));

    // Database call
    try {
      await forumApi.updatePostLikes(postId, 'dislike');
    } catch (error) {
      console.error('Failed to update dislikes:', error);
      // Revert the UI change if API call fails
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const newPost = { ...post };
          if (newPost.isDisliked) {
            newPost.dislikes--;
            newPost.isDisliked = false;
          } else {
            if (newPost.isLiked) {
              newPost.likes--;
              newPost.isLiked = false;
            }
            newPost.dislikes++;
            newPost.isDisliked = true;
          }
          return newPost;
        }
        return post;
      }));
    }

    toast({
      title: "Feedback Recorded",
      description: "Your feedback helps improve content quality",
      variant: "default"
    });
  };

  const handleBookmark = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, isBookmarked: !post.isBookmarked };
      }
      return post;
    }));

    toast({
      title: "Bookmark Updated! 🔖",
      description: "Post saved to your bookmarks",
      variant: "default"
    });
  };

  const handleShare = (post: any) => {
    const shareText = `Check out this farming post: "${post.title}" - ${post.content.substring(0, 100)}...`;
    const shareUrl = `${window.location.origin}/forum/${post.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast({
        title: "Link Copied! 📋",
        description: "Post link copied to clipboard",
        variant: "default"
      });
    }
  };

  const handleJoinWhatsAppGroup = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, whatsappGroupJoined: true };
      }
      return post;
    }));

    // Open WhatsApp group in new tab
    window.open(WHATSAPP_GROUP_URL, '_blank');
    
    toast({
      title: "Welcome to Farmer Circle! 🌾",
      description: "You've joined our WhatsApp community",
      variant: "default"
    });
  };

  const handleReply = async () => {
    if (!replyData.content.trim()) {
      toast({
        title: "Empty Reply",
        description: "Please enter your reply",
        variant: "destructive"
      });
      return;
    }

    const newReply = {
      id: Date.now(),
      author: "Current User",
      authorId: "current_user",
      content: replyData.content,
      timeAgo: "Just now",
      likes: 0,
      isLiked: false,
      replies: [] // For nested replies
    };

    setPosts(posts.map(post => {
      if (post.id === replyData.postId) {
        return { ...post, replies: [...post.replies, newReply] };
      }
      return post;
    }));

    // Database call
    try {
      await forumApi.addCommentToPost(replyData.postId, replyData.content);
    } catch (error) {
      console.error('Failed to add comment:', error);
      // Revert the UI change if API call fails
      setPosts(posts.map(post => {
        if (post.id === replyData.postId) {
          return { ...post, replies: post.replies.filter(reply => reply.id !== newReply.id) };
        }
        return post;
      }));
    }

    setReplyData({ content: "", postId: 0 });
    setIsReplyDialogOpen(false);

    toast({
      title: "Reply Posted! 💬",
      description: "Your response has been added to the discussion",
      variant: "default"
    });
  };

  const handleLikeReply = async (postId: number, replyId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updatedReplies = post.replies.map(reply => {
          if (reply.id === replyId) {
            const updatedReply = { ...reply };
            if (updatedReply.isLiked) {
              updatedReply.likes--;
              updatedReply.isLiked = false;
            } else {
              updatedReply.likes++;
              updatedReply.isLiked = true;
            }
            return updatedReply;
          }
          return reply;
        });
        return { ...post, replies: updatedReplies };
      }
      return post;
    }));

    // Database call
    try {
      await forumApi.updateReplyLikes(postId, replyId, 'like');
    } catch (error) {
      console.error('Failed to update reply likes:', error);
      // Revert the UI change if API call fails
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const updatedReplies = post.replies.map(reply => {
            if (reply.id === replyId) {
              const updatedReply = { ...reply };
              if (updatedReply.isLiked) {
                updatedReply.likes--;
                updatedReply.isLiked = false;
              } else {
                updatedReply.likes++;
                updatedReply.isLiked = true;
              }
              return updatedReply;
            }
            return reply;
          });
          return { ...post, replies: updatedReplies };
        }
        return post;
      }));
    }

    toast({
      title: "Reply Liked! 👍",
      description: "Your appreciation has been recorded",
      variant: "default"
    });
  };

  const handleDeleteReply = async (postId: number, replyId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { 
          ...post, 
          replies: post.replies.filter(reply => reply.id !== replyId) 
        };
      }
      return post;
    }));

    // Database call
    try {
      await forumApi.deleteReply(postId, replyId);
    } catch (error) {
      console.error('Failed to delete reply:', error);
      // Revert the UI change if API call fails
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return { 
            ...post, 
            replies: [...post.replies, posts.find(p => p.id === postId)?.replies.find(r => r.id === replyId)!] 
          };
        }
        return post;
      }));
    }

    toast({
      title: "Reply Deleted",
      description: "Your reply has been removed",
      variant: "default"
    });
  };

  const handleReport = (postId: number) => {
    toast({
      title: "Report Submitted! 🚨",
      description: "Thank you for helping maintain community standards",
      variant: "default"
    });
  };

  const handleViewPost = (post: any) => {
    setPosts(posts.map(p => {
      if (p.id === post.id) {
        return { ...p, views: p.views + 1 };
      }
      return p;
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Crop Management": return Sprout;
      case "Pest Control": return Bug;
      case "Soil Health": return Globe;
      case "Water Management": return Globe;
      default: return Lightbulb;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-primary rounded-2xl p-8 text-white shadow-glow">
        <h1 className="text-3xl font-bold mb-2">Knowledge Exchange Forum</h1>
        <p className="text-lg opacity-90">
          Share farming wisdom and learn from experienced farmers
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search posts, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Languages</SelectItem>
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.name}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="replies">Most Replies</SelectItem>
                  <SelectItem value="views">Most Views</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button 
                  onClick={refreshPosts}
                  variant="outline"
                  className="hover:bg-blue-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-agricultural-green hover:bg-agricultural-green-light animate-pulse-glow">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Post
                    </Button>
                  </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Share Your Knowledge</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Post Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter a descriptive title for your post"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {languages.map((language) => (
                            <SelectItem key={language.code} value={language.code}>
                              {language.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        placeholder="Share your farming knowledge, experience, or ask questions..."
                        rows={6}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({...formData, hasVoiceNote: !formData.hasVoiceNote})}
                        className={formData.hasVoiceNote ? "bg-agricultural-green text-white" : ""}
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        {formData.hasVoiceNote ? "Voice Note Added" : "Add Voice Note"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.multiple = true;
                          input.onchange = (e) => {
                            const files = (e.target as HTMLInputElement).files;
                            if (files) {
                              const fileNames = Array.from(files).map(file => file.name);
                              setFormData({...formData, images: [...formData.images, ...fileNames]});
                            }
                          };
                          input.click();
                        }}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Add Images
                      </Button>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.images.map((image, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {image}
                            <button
                              onClick={() => setFormData({
                                ...formData, 
                                images: formData.images.filter((_, i) => i !== index)
                              })}
                              className="ml-1 hover:text-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Button onClick={handleCreatePost} className="w-full bg-agricultural-green hover:bg-agricultural-green-light">
                      Share Knowledge
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forum Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post, index) => {
          const CategoryIcon = getCategoryIcon(post.category);
          return (
            <Card 
              key={post.id} 
              className="hover:shadow-hover transition-all duration-300 group animate-bounce-in"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="bg-gradient-primary p-2 rounded-lg">
                      <CategoryIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        {post.hasVoiceNote && (
                          <Button size="sm" variant="outline" className="h-6 px-2">
                            <Volume2 className="h-3 w-3 mr-1" />
                            Play
                          </Button>
                        )}
                        {post.isVerified && (
                          <Badge variant="default" className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{post.content}</p>
                      
                      {/* Images */}
                      {post.images && post.images.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {post.images.map((image, imgIndex) => (
                            <div key={imgIndex} className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Camera className="h-6 w-6 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{post.author}</span>
                          <Badge variant="outline" className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            {post.authorReputation}
                          </Badge>
                        </div>
                        <Badge variant="secondary">{post.category}</Badge>
                        <Badge variant="outline" className="text-xs">
                          <Globe className="h-3 w-3 mr-1" />
                          {post.language}
                        </Badge>
                        <span>{post.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Post Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleBookmark(post.id)}>
                        <Bookmark className="h-4 w-4 mr-2" />
                        {post.isBookmarked ? "Remove Bookmark" : "Bookmark"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(post)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Post
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReport(post.id)}>
                        <Flag className="h-4 w-4 mr-2" />
                        Report Post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLike(post.id)}
                      className={`hover:text-red-500 ${post.isLiked ? 'text-red-500' : ''}`}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDislike(post.id)}
                      className={`hover:text-red-500 ${post.isDisliked ? 'text-red-500' : ''}`}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      {post.dislikes}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        setSelectedPost(post);
                        setReplyData({ content: "", postId: post.id });
                        setIsReplyDialogOpen(true);
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.replies.length} replies
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4 mr-1" />
                      {post.views}
                    </Button>
                  </div>
                  
                  {/* WhatsApp Join Button */}
                  <div className="flex gap-2">
                    {!post.whatsappGroupJoined ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleJoinWhatsAppGroup(post.id)}
                        className="bg-green-500 hover:bg-green-600 text-white border-green-500"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Join Circle
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-green-100 text-green-700 border-green-300"
                        disabled
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Joined
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedPost(post);
                        setIsDetailsDialogOpen(true);
                        handleViewPost(post);
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>

                {/* YouTube-style Comments Section */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">
                      Comments ({post.replies.length})
                    </h4>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedPost(post);
                        setReplyData({ content: "", postId: post.id });
                        setIsReplyDialogOpen(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                  
                  {post.replies.length > 0 ? (
                    <div className="space-y-4">
                      {post.replies.slice(0, 3).map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          {/* User Avatar */}
                          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {reply.author.charAt(0)}
                          </div>
                          
                          {/* Comment Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">{reply.author}</span>
                              <span className="text-xs text-muted-foreground">{reply.timeAgo}</span>
                              {reply.authorId === "current_user" && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteReply(post.id, reply.id)}
                                      className="text-red-600"
                                    >
                                      Delete Comment
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                            <p className="text-sm text-foreground mb-2">{reply.content}</p>
                            <div className="flex items-center gap-4">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className={`h-8 px-3 ${reply.isLiked ? 'text-blue-500' : 'text-muted-foreground'}`}
                                onClick={() => handleLikeReply(post.id, reply.id)}
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {reply.likes}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 px-3 text-muted-foreground"
                                onClick={() => {
                                  setSelectedPost(post);
                                  setReplyData({ content: "", postId: post.id });
                                  setIsReplyDialogOpen(true);
                                }}
                              >
                                <Reply className="h-4 w-4 mr-1" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {post.replies.length > 3 && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setSelectedPost(post);
                            setIsDetailsDialogOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          View all {post.replies.length} comments
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create First Post
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to Post</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{selectedPost.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedPost.content}</p>
              </div>
              <div>
                <Label htmlFor="reply-content">Your Reply</Label>
                <Textarea
                  id="reply-content"
                  value={replyData.content}
                  onChange={(e) => setReplyData({...replyData, content: e.target.value})}
                  placeholder="Share your thoughts, experience, or ask follow-up questions..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleReply} className="flex-1 bg-agricultural-green hover:bg-agricultural-green-light">
                  Post Reply
                </Button>
                <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Detailed Post View Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="bg-card border-border max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Post Details</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-6">
              {/* Post Header */}
              <div className="border-b pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white text-lg font-semibold">
                    {selectedPost.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-bold">{selectedPost.title}</h2>
                      {selectedPost.isVerified && (
                        <Badge variant="default" className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="font-medium">{selectedPost.author}</span>
                      <Badge variant="secondary">{selectedPost.category}</Badge>
                      <Badge variant="outline">
                        <Award className="h-3 w-3 mr-1" />
                        {selectedPost.authorReputation} points
                      </Badge>
                      <Badge variant="outline">
                        <Globe className="h-3 w-3 mr-1" />
                        {selectedPost.language}
                      </Badge>
                      <span>{selectedPost.timeAgo}</span>
                    </div>
                    <p className="text-foreground leading-relaxed">{selectedPost.content}</p>
                  </div>
                </div>
                
                {/* Images */}
                {selectedPost.images && selectedPost.images.length > 0 && (
                  <div className="flex gap-3 mt-4">
                    {selectedPost.images.map((image, imgIndex) => (
                      <div key={imgIndex} className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedPost.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Post Stats */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{selectedPost.likes}</div>
                  <div className="text-sm text-muted-foreground">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-500">{selectedPost.dislikes}</div>
                  <div className="text-sm text-muted-foreground">Dislikes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{selectedPost.replies.length}</div>
                  <div className="text-sm text-muted-foreground">Comments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{selectedPost.views}</div>
                  <div className="text-sm text-muted-foreground">Views</div>
                </div>
              </div>

              {/* All Comments */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    All Comments ({selectedPost.replies.length})
                  </h3>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setReplyData({ content: "", postId: selectedPost.id });
                      setIsReplyDialogOpen(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
                
                {selectedPost.replies.length > 0 ? (
                  <div className="space-y-6">
                    {selectedPost.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-4">
                        {/* User Avatar */}
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                          {reply.author.charAt(0)}
                        </div>
                        
                        {/* Comment Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{reply.author}</span>
                            <span className="text-sm text-muted-foreground">{reply.timeAgo}</span>
                            {reply.authorId === "current_user" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteReply(selectedPost.id, reply.id)}
                                    className="text-red-600"
                                  >
                                    Delete Comment
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                          <p className="text-foreground mb-3">{reply.content}</p>
                          <div className="flex items-center gap-4">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className={`h-8 px-3 ${reply.isLiked ? 'text-blue-500' : 'text-muted-foreground'}`}
                              onClick={() => handleLikeReply(selectedPost.id, reply.id)}
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {reply.likes}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 px-3 text-muted-foreground"
                              onClick={() => {
                                setReplyData({ content: "", postId: selectedPost.id });
                                setIsReplyDialogOpen(true);
                              }}
                            >
                              <Reply className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h4 className="text-lg font-semibold mb-2">No comments yet</h4>
                    <p>Be the first to share your thoughts on this post!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Community Guidelines */}
      <Card className="shadow-card border-agricultural-green border-l-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Community Guidelines & WhatsApp Circle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Encouraged
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Share practical farming experiences and insights</li>
                <li>• Ask specific, detailed questions about farming</li>
                <li>• Include photos of your crops, issues, or solutions</li>
                <li>• Use voice notes for complex explanations</li>
                <li>• Help fellow farmers with your expertise</li>
                <li>• Join WhatsApp Circle for real-time discussions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Not Allowed
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Spam or promotional content</li>
                <li>• Misinformation about farming practices</li>
                <li>• Personal attacks or disrespectful language</li>
                <li>• Off-topic discussions</li>
                <li>• Sharing inappropriate content</li>
                <li>• Violating WhatsApp group rules</li>
              </ul>
            </div>
          </div>
          
          {/* WhatsApp Circle Info */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-800">Join Our WhatsApp Farmer Circle</h4>
            </div>
            <p className="text-sm text-green-700 mb-3">
              Connect with farmers in real-time! Join our WhatsApp group for instant discussions, 
              quick questions, and community support. Click "Join Circle" on any post to get started.
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => window.open(WHATSAPP_GROUP_URL, '_blank')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Join WhatsApp Group
              </Button>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                <Users className="h-3 w-3 mr-1" />
                500+ Active Farmers
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}