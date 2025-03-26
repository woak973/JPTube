import { YTNodes, Misc } from 'youtubei.js';

export interface VerticalProductCard {
  title: string;
  thumbnail: Misc.Thumbnail[];
  endpoint: YTNodes.NavigationEndpoint;
  price: string;
  additional_fees_text: string;
  accessibility_title: string;
  merchant_name: string;
  from_merchant_text?: string;
  show_open_in_new_icon: boolean;
  use_new_style: boolean;
  cta_text: Misc.Text;
  cta_style: string;
  layout_style: string;
  deals_data: {
    current_price: string;
    sales_data?: {
      original_price: string;
      sales_price_accessibility_label: string;
    };
    sales?: {
      original_price: string;
      sales_price_accessibility_label: string;
    };
  };
  price_replacement_text?: string;
}