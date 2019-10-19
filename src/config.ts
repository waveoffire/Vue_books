interface IConfig {
  api: string;
  logo: string;
  title: string;
}

let config = {
  current: <IConfig>{},
  dev: <IConfig>{
    api: "https://www.googleapis.com/books/v1",
    title: "Books Searcher"
  }
};

config.current = config.dev;

export default config;
