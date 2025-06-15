import { Success } from "@/components/ui/Icons";
import { LocalLink } from "@/components/util/LocalizedNavigation";
import { getServerTranslation } from "@/services/server/translation.service";
import { Language } from "@/types";

export default async function Page({ params }: { params: Promise<{ lang: Language; id: string }> }) {
  const { id, lang } = await params;
  const t = await getServerTranslation(lang);

  return (
    <div className="mt-28 flex flex-col items-center justify-center">
      <div className="mb-10 w-16 fill-green-600">
        <Success />
      </div>
      <h1 className="mb-4 text-center text-xl font-bold text-gray-400">
        {t("checkout.orderPlacedSuccessfully")} <span className="text-primary">{id}</span>
      </h1>
      <LocalLink className="bg-primary px-4 py-2 text-white" href="/">
        {t("continueShopping")}
      </LocalLink>
    </div>
  );
}
