export type ShareChannel = "kakao" | "copy_link" | "web_share";

export type ShareStats = {
  shareCount: number;
  visitCount: number;
  conversionCount: number;
};

export type ShareMessageContent = {
  title: string;
  description: string;
  shareUrl: string;
  imageUrl: string;
};
