import { useEffect, useState } from "react";
import { obtenerPeriodos } from "../Service/PeriodoService";

export const usePeriodos = () => {
    const [periodos, setPeriodos] = useState([]);
    useEffect(() => {
        (async () => {
            const data = await obtenerPeriodos();
            setPeriodos(data);
        })();
    }, []);
    return { periodos };
}