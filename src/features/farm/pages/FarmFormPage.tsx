/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addFarm, updateFarm } from "@/redux/slices/producerSlice";
import type { RootState } from "@/redux/store";

import MainLayout from "@/components/organisms/MainLayout";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormButton from "@/components/atoms/FormButton";
import Button from "@/components/atoms/Button";

import { brazilianStates } from "@/services/mocks/statesData";
import type { FarmForm } from "../types";

import { PageTitle } from "../styles/stylesFarmListPage";
import {
  Container,
  ContainerForm,
  Form,
  FormActions,
  FormRow,
} from "../styles/stylesFarmFormPage";

export default function FarmFormPage() {
  const [formData, setFormData] = useState<FarmForm>({
    producerId: 0,
    name: "",
    city: "",
    state: "",
    totalArea: 0,
    agricultableArea: 0,
    vegetationArea: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [nameInputError, setNameInputError] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const producers = useSelector((state: RootState) => state.producer.producers);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name?: string; value: unknown } }
  ) => {
    const name = e.target.name || "";
    let value = e.target.value;

    const numericFields: (keyof FarmForm)[] = [
      "producerId",
      "totalArea",
      "agricultableArea",
      "vegetationArea",
    ];

    if (numericFields.includes(name as keyof FarmForm)) {
      value = value === "" ? "" : Number(value);
    }

    setNameInputError(false);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const producerOptions = useMemo(() => {
    return producers.map((producer: any) => ({
      value: producer.id,
      label: producer.name,
    }));
  }, [producers]);

  const brazilianStateOptions = brazilianStates.map((state) => ({
    value: state.name,
    label: state.name,
  }));

  useEffect(() => {
    if (id) {
      const farmId = Number(id);

      const producer = producers.find((p: any) =>
        p.farms.some((f: any) => f.id === farmId)
      );

      const farm = producer?.farms.find((f: any) => f.id === farmId);

      if (farm && producer) {
        setIsEditing(true);
        setFormData({
          producerId: producer.id,
          name: farm.name,
          city: farm.city,
          state: farm.state,
          totalArea: farm.totalArea,
          agricultableArea: farm.agricultableArea,
          vegetationArea: farm.vegetationArea,
        });
      }
    }
  }, [id, producers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.producerId || formData.producerId === 0) {
      toast.error("É obrigatório selecionar um produtor!");
      return;
    }

    if (formData.name === "") {
      toast.error("O campo Nome da Fazenda não pode estar vazio!");
      setNameInputError(true);
      return;
    }

    if (!formData.state) {
      toast.error("É obrigatório selecionar um estado!");
      return;
    }

    const currentProducer = producers.find(
      (p: any) => p.id === formData.producerId
    );

    const farms = currentProducer?.farms ?? [];
    const newFarmId =
      farms.length > 0 ? Math.max(...farms.map((f: any) => f.id)) + 1 : 1;

    if (isEditing && id) {
      dispatch(
        updateFarm({
          producerId: formData.producerId,
          farmId: Number(id),
          updatedFarm: formData,
        })
      );
      toast.success("Fazenda editada com sucesso!");
    } else {
      dispatch(
        addFarm({
          producerId: formData.producerId,
          newFarm: {
            ...formData,
            id: newFarmId,
            crops: [],
          },
        })
      );
      toast.success("Fazenda cadastrada com sucesso!");
    }

    navigate("/farms");
  };

  return (
    <MainLayout>
      {!isEditing ? (
        <PageTitle>Cadastrar Nova Fazenda</PageTitle>
      ) : (
        <PageTitle>Editar Fazenda</PageTitle>
      )}
      <Container>
        <ContainerForm>
          <Form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <FormRow>
                <Select
                  label="Produtor"
                  name="producerId"
                  value={String(formData.producerId)}
                  onChange={handleChange}
                  options={producerOptions}
                  disabled={isEditing}
                />
              </FormRow>
              <FormRow>
                <Input
                  label="Nome da Fazenda"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  error={nameInputError}
                  helperText={nameInputError ? "Nome inválido" : null}
                />
              </FormRow>
              <FormRow>
                <Input
                  label="Cidade"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  variant="outlined"
                />
              </FormRow>
              <FormRow>
                <Select
                  label="Estado"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  options={brazilianStateOptions}
                />
              </FormRow>
              <FormRow>
                <Input
                  label="Área Total (ha)"
                  name="totalArea"
                  value={formData.totalArea}
                  onChange={handleChange}
                  variant="outlined"
                  type="number"
                />
              </FormRow>
              <FormRow>
                <Input
                  label="Área Agricultável (ha)"
                  name="agricultableArea"
                  value={formData.agricultableArea}
                  onChange={handleChange}
                  variant="outlined"
                  type="number"
                />
              </FormRow>
              <FormRow>
                <Input
                  label="Área de Vegetação (ha)"
                  name="vegetationArea"
                  value={formData.vegetationArea}
                  onChange={handleChange}
                  variant="outlined"
                  type="number"
                />
              </FormRow>
            </div>
            <FormActions>
              <FormButton
                type="submit"
                variant="contained"
                label={isEditing ? "Editar" : "Cadastrar"}
                style={{ minWidth: "120px" }}
              />
              <Button
                variant="contained"
                label="Cancelar"
                onClick={() => navigate("/farms")}
                style={{ minWidth: "120px", backgroundColor: "#f44336" }}
              />
            </FormActions>
          </Form>
        </ContainerForm>
      </Container>
    </MainLayout>
  );
}
