"use client";

import LoadingSpinner from "@/components/LoadingUi/LoadingSpinner";
import OrderItem from "@/app/[lang]/(web)/user/orders/components/OrderItem";
import { ORDERS_QUERY_KEY, USER_QUERY_KEY } from "@/constants/query-keys";
import { useTranslation } from "@/context/Translation";
import { getOrders } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";

export default function OrdersPage() {
  const { t } = useTranslation();

  const ordersQuery = useQuery({
    queryKey: [USER_QUERY_KEY, ORDERS_QUERY_KEY],
    queryFn: () => getOrders()
  });
  const orders = ordersQuery.data ?? [];

  return (
    <>
      <h1 className="hidden border-b py-4 text-4xl md:block">{t("profile.orders")}</h1>
      <ul>
        {ordersQuery.isFetching && <LoadingSpinner />}

        {orders.length > 0 ? (
          orders.map((order) => <OrderItem key={order._id} order={order} />)
        ) : (
          <li className="py-8 text-center text-gray-400">No Orders Avilable</li>
        )}
      </ul>
    </>
  );
}
