import { useEffect } from "react";
import { setNavigate } from "../utils/navigation";
import { useNavigate } from "react-router";

export default function GlobalNavigateSetter() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return null;
}
