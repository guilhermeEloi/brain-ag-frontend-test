import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "@/components/organisms/MainLayout";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormButton from "@/components/atoms/FormButton";
import Button from "@/components/atoms/Button";

import { mockProducers } from "@/services/mocks/producerData";
import type { CropForm } from "../types";

import { PageTitle } from "../styles/stylesCropListPage";
import {
  Container,
  ContainerForm,
  Form,
  FormActions,
  FormRow,
} from "../styles/stylesCropFormPage";

export default function CropFormPage() {
  const [formData, setFormData] = useState<CropForm>({
    producerId: 0,
    farmId: 0,
    culture: "",
    harvest: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [cultureInputError, setCultureInputError] = useState<boolean>(false);
  const [harvestInputError, setHarvestInputError] = useState<boolean>(false);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name?: string; value: unknown } }
  ) => {
    const name = e.target.name || "";
    const value = e.target.value as string;
    setCultureInputError(false);
    setHarvestInputError(false);

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.harvest === "") {
      toast.error("O campo Safra não pode estar vazio");
      setHarvestInputError(true);
      return;
    }

    if (formData.culture === "") {
      toast.error("O campo Cultura não pode estar vazio");
      setCultureInputError(true);
      return;
    }

    if (isEditing) {
      toast.success("Cultura editada!");
      navigate("/crops");
      console.log("Editando cultura:", formData);
    } else {
      toast.success("Cultura cadastrada!");
      navigate("/crops");
      console.log("Criando cultura:", formData);
    }
  };

  const producersOptions = useMemo(() => {
    return mockProducers.map((producer) => ({
      value: producer.id,
      label: producer.name,
    }));
  }, []);

  const farmOptions = useMemo(() => {
    const selectedProducer = mockProducers.find(
      (p) => p.id === formData.producerId
    );
    return (
      selectedProducer?.farms.map((farm) => ({
        value: farm.id,
        label: farm.name,
      })) ?? []
    );
  }, [formData.producerId]);

  useEffect(() => {
    if (id) {
      const farmId = Number(id);

      const producer = mockProducers.find((p) =>
        p.farms.some((f) => f.id === farmId)
      );

      if (producer) {
        const farm = producer.farms.find((f) => f.id === farmId);
        const crop = farm?.crops?.[0];

        if (farm && crop) {
          setIsEditing(true);
          setFormData({
            producerId: producer.id,
            farmId: farm.id,
            culture: crop.culture,
            harvest: crop.harvest,
          });
        }
      }
    }
  }, [id]);

  return (
    <MainLayout>
      {!isEditing ? (
        <PageTitle>Cadastrar Nova Cultura</PageTitle>
      ) : (
        <PageTitle>Editar Cultura</PageTitle>
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
                  value={formData.producerId}
                  onChange={handleChange}
                  options={producersOptions}
                />
              </FormRow>
              {farmOptions.length > 0 ? (
                <FormRow>
                  <Select
                    label="Fazenda"
                    name="farmId"
                    value={formData.farmId}
                    onChange={handleChange}
                    options={farmOptions}
                  />
                </FormRow>
              ) : null}
              <FormRow>
                <Input
                  label="Safra"
                  name="harvest"
                  value={formData.harvest}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  error={harvestInputError}
                  helperText={harvestInputError ? "Safra inválida" : null}
                />
              </FormRow>
              <FormRow>
                <Input
                  label="Cultura"
                  name="culture"
                  value={formData.culture}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  error={cultureInputError}
                  helperText={cultureInputError ? "Cultura inválida" : null}
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
                onClick={() => navigate("/crops")}
                style={{ minWidth: "120px", backgroundColor: "	#f44336" }}
              />
            </FormActions>
          </Form>
        </ContainerForm>
      </Container>
    </MainLayout>
  );
}
