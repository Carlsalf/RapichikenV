import {ResponsivePage} from "../components/ResponsivePage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useEffect, useMemo, useState} from "react";
import {useOrders} from "../hooks/orders/useOrders";
import qs from "qs";
import {PAYMENT_METHODS} from "../types/Order";
import {Card} from "react-bootstrap";

const CajaChica = () => {
    const [startDate, setStartDate] = useState(new Date());

    const { getOrders, orders } = useOrders();

    const params = useMemo<string>(() => qs.stringify({
            filters: {
                date: {
                    $eq: startDate.toISOString(),
                },
                tipoPedido: 'tienda'
            }
        }, {
            encodeValuesOnly: true,
        }), [startDate]);

    const [cash, yape, pos] = useMemo<number[]>(() => {
        if (orders.length) {
            const cash = orders.filter(order => order.metodoPago === PAYMENT_METHODS.YAPE).reduce((acc, value) => acc + value.total, 0);
            const yape = orders.filter(order => order.metodoPago === PAYMENT_METHODS.CASH).reduce((acc, value) => acc + value.total, 0);
            const pos = orders.filter(order => order.metodoPago === PAYMENT_METHODS.POS).reduce((acc, value) => acc + value.total, 0);

            return [cash, yape, pos];
        }

        return [0, 0, 0]
    }, [orders]);

    useEffect(() => {
        getOrders(params);
    }, [params]);

  return (
      <ResponsivePage>
          <div className='container'>
              <div className='d-flex flex-column'>
                  <h1 className='align-self-center'>Caja chica</h1>
                  <div className='d-flex justify-content-start mb-5'>
                      <label className='me-2'>Fecha:</label>
                      <DatePicker selected={startDate} onChange={(date:Date) => setStartDate(date)} maxDate={new Date()} wrapperClassName='w-25' />
                  </div>
                  {orders.length > 0 ? (
                      <div className='d-grid' style={{ gridTemplateColumns: 'auto auto auto', columnGap: '40px' }}>
                          <Card className='text-center'>
                              <Card.Title>Yape</Card.Title>
                              <Card.Body>{yape}</Card.Body>
                          </Card>
                          <Card className='text-center'>
                              <Card.Title>Efectivo</Card.Title>
                              <Card.Body>{cash}</Card.Body>
                          </Card>
                          <Card className='text-center'>
                              <Card.Title>POS</Card.Title>
                              <Card.Body>{pos}</Card.Body>
                          </Card>
                      </div>
                      ) : (
                      <p>No se encontro ordenes para la fecha</p>
                  )}
              </div>
          </div>
      </ResponsivePage>
  );
}

export default CajaChica;
