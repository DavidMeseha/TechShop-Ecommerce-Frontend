import { Success } from "@/components/ui/Icons";
import { LocalLink } from "@/components/LocalizedNavigation";
import { getDictionary } from "@/dictionary";
import { Language } from "@/types";

export default async function Page({ params }: { params: { lang: Language; id: string } }) {
  const dictionary = await getDictionary(params.lang);

  return (
    <div className="mt-28 flex flex-col items-center justify-center">
      <div className="mb-10 w-16 fill-green-600">
        <Success />
      </div>
      <h1 className="mb-4 text-center text-xl font-bold text-secondary">
        {dictionary["checkout.orderPlacedSuccessfully"]} <span className="text-primary">{params.id}</span>
      </h1>
      <LocalLink className="bg-primary px-4 py-2 text-white" href="/">
        {dictionary["continueShopping"]}
      </LocalLink>
    </div>
  );
}
