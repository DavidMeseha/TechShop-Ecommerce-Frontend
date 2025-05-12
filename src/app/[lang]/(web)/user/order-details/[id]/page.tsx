import { IFullProduct, IOrder, IProductAttribute, Language } from "@/types";
import Image from "next/image";
import { getServerTranslation } from "@/dictionary";
import axios from "axios";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function getOrder(id: string) {
  return axios
    .get<IOrder>(`/api/user/order/${id}`, {
      headers: { Authorization: `Bearer ${(await cookies()).get("token")?.value}` }
    })
    .then((res) => res.data);
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string; lang: Language }> }) {
  const { id, lang } = await params;
  const t = await getServerTranslation(lang);
  try {
    const order = await getOrder(id);

    return (
      <>
        <div className="p-4">
          <div className="relative mt-4 rounded-md border p-4">
            <div className="absolute -top-2 bg-white px-4 text-xs font-normal text-gray-400">{order?._id}</div>
            <ul>
              {order.items.map((item) => (
                <ProductListItem item={item} key={item.product.seName} />
              ))}
            </ul>
          </div>

          <div className="mt-4 flex w-full flex-col-reverse gap-4 rounded-md border p-4 md:flex-row md:gap-10">
            <div className="grow">
              <div className="mb-2 text-lg font-bold">Order Statuses</div>
              <div className="grid grid-cols-2 p-2">
                <div>{t("orderDetails.billing")}:</div> <div className="text-end">{order?.billingStatus}</div>
              </div>
              <div className="grid grid-cols-2 p-2">
                <div>{t("orderDetails.shipping")}:</div> <div className="text-end">{order?.shippingStatus}</div>
              </div>
            </div>
            <div className="grow">
              <div className="mb-2 text-lg font-bold">{t("orderDetails.payment")}</div>
              <div className="grid grow grid-cols-2 p-2">
                <div>{t("orderDetails.subtotal")}</div>
                <div className="text-end">{order?.subTotal}$</div>
              </div>

              <div className="grid grow grid-cols-2 border-t-2 p-2">
                <div>{t("orderDetails.shippingFees")}</div>
                <div className="text-end">{order?.shippingFees}$</div>
              </div>

              <div className="grid grow grid-cols-2 border-t-2 p-2">
                <div>{t("orderDetails.codFees")}</div>
                <div className="text-end">{order?.billingStatus === "cod" ? 10 : 0}$</div>
              </div>

              <div className="grid grow grid-cols-2 border-t-2 border-black p-2">
                <div>{t("total")}</div>
                <div className="text-end">{order?.totalValue ?? 0 + (order?.billingStatus === "cod" ? 10 : 0)}$</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch {
    notFound();
  }
}

function ProductListItem({
  item
}: {
  item: { product: IFullProduct; quantity: number; attributes: IProductAttribute[] };
}) {
  return (
    <li className="flex items-center justify-between py-2">
      <div className="flex w-full items-center gap-3">
        <Image
          alt={item.product.name}
          className="bg-lightGray h-14 w-14 rounded-md object-contain"
          height={66}
          src={item.product.pictures[0].imageUrl ?? "/images/placeholder-user.jpg"}
          width={66}
        />
        <div>
          <p className="font-bold">{item.product.name}</p>
          <p className="text-gray-400">{item.product.price.price}$</p>
        </div>
        <span className="font-normal text-gray-400"> X{item.quantity}</span>
      </div>
      <p>{item.product.price.price * item.quantity}$</p>
    </li>
  );
}
