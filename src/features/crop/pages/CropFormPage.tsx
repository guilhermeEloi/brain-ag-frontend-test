/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCrop, updateCrop } from "@/redux/slices/producerSlice";
import type { RootState } from "@/redux/store";

import MainLayout from "@/components/organisms/MainLayout";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormButton from "@/components/atoms/FormButton";
import Button from "@/components/atoms/Button";

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
    cropId: 0,
    culture: "",
    harvest: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [cultureInputError, setCultureInputError] = useState<boolean>(false);
  const [harvestInputError, setHarvestInputError] = useState<boolean>(false);

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
    const value = e.target.value as string;
    setCultureInputError(false);
    setHarvestInputError(false);

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const crops = useMemo(() => {
    const producer = producers.find((p) => p.id === formData.producerId);
    const farm = producer?.farms.find((f) => f.id === formData.farmId);
    return farm?.crops || [];
  }, [formData.producerId, formData.farmId, producers]);

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
      dispatch(
        updateCrop({
          producerId: formData.producerId,
          farmId: formData.farmId,
          cropId: formData.cropId,
          updatedCrop: {
            culture: formData.culture,
            harvest: formData.harvest,
          },
        })
      );
      toast.success("Cultura editada!");
    } else {
      const maxId =
        crops.length > 0 ? Math.max(...crops.map((c: any) => c.id)) : 0;

      const newCrop = {
        id: maxId + 1,
        culture: formData.culture,
        harvest: formData.harvest,
      };

      dispatch(
        addCrop({
          producerId: formData.producerId,
          farmId: formData.farmId,
          newCrop,
        })
      );
      toast.success("Cultura cadastrada!");
    }

    navigate("/crops");
  };

  const producersOptions = useMemo(() => {
    return producers.map((producer: any) => ({
      value: producer.id,
      label: producer.name,
    }));
  }, [producers]);

  const farmOptions = useMemo(() => {
    const selectedProducer = producers.find(
      (p: any) => p.id === formData.producerId
    );
    return (
      selectedProducer?.farms.map((farm: any) => ({
        value: farm.id,
        label: farm.name,
      })) ?? []
    );
  }, [formData.producerId, producers]);

  useEffect(() => {
    if (id) {
      const cropId = Number(id);

      let foundProducer: any = null;
      let foundFarm: any = null;
      let foundCrop: any = null;

      for (const producer of producers) {
        for (const farm of producer.farms) {
          const crop = farm.crops.find((c: any) => c.id === cropId);
          if (crop) {
            foundProducer = producer;
            foundFarm = farm;
            foundCrop = crop;
            break;
          }
        }
        if (foundCrop) break;
      }

      if (foundProducer && foundFarm && foundCrop) {
        setIsEditing(true);
        setFormData({
          producerId: foundProducer.id,
          farmId: foundFarm.id,
          cropId: foundCrop.id,
          culture: foundCrop.culture,
          harvest: foundCrop.harvest,
        });
      }
    }
  }, [id, producers]);

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
                  value={
                    formData.producerId === 0 ? "" : String(formData.producerId)
                  }
                  onChange={handleChange}
                  options={producersOptions}
                  disabled={isEditing === true ? true : false}
                />
              </FormRow>
              {farmOptions.length > 0 ? (
                <FormRow>
                  <Select
                    label="Fazenda"
                    name="farmId"
                    value={String(formData.farmId)}
                    onChange={handleChange}
                    options={farmOptions}
                    disabled={isEditing === true ? true : false}
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
                style={{ minWidth: "120px", backgroundColor: "#f44336" }}
              />
            </FormActions>
          </Form>
        </ContainerForm>
      </Container>
    </MainLayout>
  );
}
