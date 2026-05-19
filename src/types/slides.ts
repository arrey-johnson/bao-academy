export type SlideBlock =
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "code"; lang: string; snippet: string }
  | { type: "challenge"; prompt: string; hint?: string }
  | { type: "visual"; caption?: string };

export type SlideContent = {
  blocks: SlideBlock[];
};

export type Slide = {
  id: string;
  lesson_id: string;
  sort_order: number;
  slide_type: string;
  title: string | null;
  content: SlideContent;
};

export type Lesson = {
  id: string;
  module_id: string;
  title: string;
  slug: string;
  description: string | null;
  estimated_minutes: number;
  sort_order: number;
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  track: string;
};

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  current_streak: number;
  last_activity_date: string | null;
};

export type LessonProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_slide_ids: string[];
  current_slide_index: number;
  bookmark_slide_index: number | null;
  is_completed: boolean;
};
