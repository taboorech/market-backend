type BrandGuidelines = {
  title: {
    available_words: string[];
    max_length: number;
    format: string;
    example: string;
  };
  description: {
    max_length: number;
    tone: string;
    required_elements: string[];
    example: string;
  };
  meta_tags: {
    title: {
      format: string;
      max_length: number;
      example: string;
    };
    description: {
      max_length: number;
      example: string;
    };
    keywords: string[];
  };
  images: {
    alt_text_format: string;
    example: string;
  };
};

export type { BrandGuidelines };