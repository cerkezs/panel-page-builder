// HTML şablonlarını raw string olarak Vite üzerinden import ediyoruz.
import indexTpl from "../../templates/index.html?raw";
import hakkimdaTpl from "../../templates/hakkimda.html?raw";
import hizmetlerTpl from "../../templates/hizmetler.html?raw";
import portfolyoTpl from "../../templates/portfolyo.html?raw";
import iletisimTpl from "../../templates/iletisim.html?raw";

export const TEMPLATES: Record<string, string> = {
  index: indexTpl,
  hakkimda: hakkimdaTpl,
  hizmetler: hizmetlerTpl,
  portfolyo: portfolyoTpl,
  iletisim: iletisimTpl,
};
