import { YTNodes, Helpers, APIResponseTypes, Parser } from 'youtubei.js';

export default class MiniAppGameInfoDialogView extends Helpers.YTNode {
  static override type = 'MiniAppGameInfoDialogView';

  dialog_title: string;
  close_button: YTNodes.ButtonView | null;
  image: {
    sources: {
      url: string;
      width: number;
      height: number;
    }[];
  };

  title: string;
  primary_genre: string;
  description: string;
  logging_directives: {
    tracking_params: string;
    visibility: {
      types: string;
    };
  };

  info_row: {
    label?: string;
    value?: string;
    attributed_label?: {
      content: string;
      command_runs: {
        start_index: number;
        length: number;
        on_tap: {
          innertube_command: YTNodes.NavigationEndpoint;
        };
      }[];
      style_runs: {
        start_index: number;
        length: number;
        weight_label: string;
      }[];
    };
  }[];

  constructor(data: APIResponseTypes.RawNode) {
    super();
    this.dialog_title = data.dialogTitle;
    this.close_button = Parser.parseItem(data.closeButton, YTNodes.ButtonView);
    this.image = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sources: data.image.sources.map((item: any) => ({
        url: item.url,
        width: item.width,
        height: item.height,
      })),
    };
    this.title = data.title;
    this.primary_genre = data.primaryGenre;
    this.description = data.description;
    this.logging_directives = {
      tracking_params: data.loggingDirectives.trackingParams,
      visibility: {
        types: data.loggingDirectives.visibility.types,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.info_row = data.infoRow.map((item: any) => ({
      label: Reflect.has(item, 'label') ? item.label : undefined,
      value: Reflect.has(item, 'value') ? item.value : undefined,
      attributed_label: Reflect.has(item, 'attributedLabel')
        ? {
            content: item.attributedLabel.content,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            command_runs: item.attributedLabel.commandRuns.map((item: any) => ({
              start_index: item.startIndex,
              length: item.length,
              on_tap: {
                innertube_command: new YTNodes.NavigationEndpoint(item.onTap.innertubeCommand),
              },
            })),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style_runs: item.attributedLabel.styleRuns.map((item: any) => ({
              start_index: item.startIndex,
              length: item.length,
              weight_label: item.weightLabel,
            })),
          }
        : undefined,
    }));
  }
}
