export interface AppPlugin {
  handler(): Promise<void>;
}
