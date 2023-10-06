export interface Entity {
  stringKey: string;
  english: string;
  [languageCode: string]: string;
}

export const languageRecord = {
  en: "English",
  "es-LA": "Spanish (Latin America)",
  "es-ES": "Spanish (Spain)",
  "pt-BR": "Portuguese (Brazil)",
  pl: "Polish",
  es: "Spanish (Spain)",
  nl: "Dutch",
  fr: "French",
  de: "German",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  ru: "Russian",
  zh: "Chinese (Simplified)",
  "zh-Hant": "Chinese (Traditional)",
  sv: "Swedish",
  tr: "Turkish",
  ar: "Arabic",
  hu: "Hungarian",
  jp: "Japanese",
  no: "Norwegian",
  uk: "Ukrainian",
  cs: "Czech",
  all: "All Languages",
};

type langop = keyof typeof languageRecord;

export type LanguageOption = { value: string; label: string };

export const languageOptions: LanguageOption[] = Object.entries(
  languageRecord
).map(([value, label]) => ({
  value,
  label,
}));

// interface LocalizeRecords {
//   LocalizeRecords(
//     records: Entity[],
//     target_languages: string[],
//     chunkSize: number,
//     requestOptions: LocalizeRecordsRequestOptions
//   ): Promise<Entity[]>;
// }

export function LocalizeRecords(
  records: Entity[],
  target_languages: string[],
  chunkSize: number,
  requestOptions: LocalizeRecordsRequestOptions
): Promise<Entity[]> {
  const translatedRecords = records.map((record) => {
    const translatedRecord = { ...record };
    target_languages.forEach((language) => {
      translatedRecord[language] = record.english;
    });
    return translatedRecord;
  });

  return Promise.resolve(translatedRecords);
}

interface LocalizeRecordsRequestOptions {
  max_retries: number;
  timeout_sec: number;
  timeout_multiplyer: number;
  parallel_requests: number;
}
