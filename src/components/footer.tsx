import { useTranslation } from "react-i18next";

export default function Footer() {
  const { i18n } = useTranslation();

  return (<div className="footer ml-[-2rem] px-6 container fixed bottom-0 mb-6 flex justify-between">
    <div className="next flex-1 text-right">
      <select className="border-solid border-2 border-background text-background bg-foreground py-2 rounded" name="lang" id="lang" onChange={(e) => i18n.changeLanguage(e.target.value)}>
        {
          ['en-US', 'pt-BR'].map((lang: string) => {
            return <option key={lang} value={lang}>{lang}</option>;
          })
        }
      </select>
    </div>
  </div>);
}
