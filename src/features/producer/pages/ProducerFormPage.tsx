/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProducer, editProducer } from "@/redux/slices/producerSlice";

import MainLayout from "@/components/organisms/MainLayout";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormButton from "@/components/atoms/FormButton";
import Button from "@/components/atoms/Button";

import type { ProducerForm } from "../types";
import {
  isValidCNPJ,
  isValidCPF,
  isValidEmail,
  maskCPF,
  maskCNPJ,
  maskPhone,
  maskCellphone,
} from "@/utils";

import { PageTitle } from "../styles/stylesProducerListPage";
import {
  Container,
  ContainerForm,
  Form,
  FormActions,
  FormRow,
} from "../styles/stylesProducerFormPage";

export default function ProducerFormPage() {
  const [formData, setFormData] = useState<ProducerForm>({
    name: "",
    document: "",
    phone: "",
    email: "",
    documentType: "CPF",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [nameInputError, setNameInputError] = useState(false);
  const [documentInputError, setDocumentInputError] = useState(false);
  const [emailInputError, setEmailInputError] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const producers = useSelector((state: any) => state.producer.producers);

  useEffect(() => {
    if (id) {
      const idNumber = Number(id);
      const producer = producers.find((p: any) => p.id === idNumber);
      if (producer) {
        setIsEditing(true);
        setFormData({
          name: producer.name,
          document: producer.document,
          phone: producer.phone || "",
          email: producer.email || "",
          documentType: producer.documentType || "CPF",
        });
      }
    }
  }, [id, producers]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name?: string; value: unknown } }
  ) => {
    const name = e.target.name || "";
    let value = e.target.value as string;
    setNameInputError(false);
    setDocumentInputError(false);
    setEmailInputError(false);

    if (name === "document") {
      if (formData.documentType === "CPF") {
        value = maskCPF(value);
      } else {
        value = maskCNPJ(value);
      }
    }

    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");
      if (onlyNumbers.length > 10) {
        value = maskCellphone(value);
      } else {
        value = maskPhone(value);
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const onlyNumbers = (str: string) => str.replace(/\D/g, "");

    if (formData.name === "") {
      toast.error("O campo Nome do produtor não pode estar vazio!");
      setNameInputError(true);
      return;
    }

    if (
      formData.documentType === "CPF" &&
      !isValidCPF(onlyNumbers(formData.document))
    ) {
      setDocumentInputError(true);
      toast.error("Número de CPF inválido");
      return;
    }

    if (
      formData.documentType === "CNPJ" &&
      !isValidCNPJ(onlyNumbers(formData.document))
    ) {
      setDocumentInputError(true);
      toast.error("Número de CNPJ inválido");
      return;
    }

    if (formData.email && !isValidEmail(formData.email)) {
      setEmailInputError(true);
      toast.error("Email inválido");
      return;
    }

    const currentProducer = producers.find((p: any) => p.id === Number(id));

    if (isEditing && id) {
      dispatch(
        editProducer({
          ...currentProducer,
          id: Number(id),
          name: formData.name,
          document: formData.document,
          phone: formData.phone,
          email: formData.email,
          documentType: formData.documentType,
        })
      );
      toast.success("Produtor editado!");
    } else {
      const newId =
        producers.length > 0
          ? Math.max(...producers.map((p: any) => p.id)) + 1
          : 1;

      dispatch(
        addProducer({
          id: newId,
          name: formData.name,
          document: formData.document,
          phone: formData.phone,
          email: formData.email,
          documentType: formData.documentType,
          farms: [],
        })
      );
      toast.success("Produtor cadastrado!");
    }

    navigate("/producers");
  };

  return (
    <MainLayout>
      {!isEditing ? (
        <PageTitle>Cadastrar Novo Produtor</PageTitle>
      ) : (
        <PageTitle>Editar Produtor</PageTitle>
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
                <Input
                  label="Nome do Produtor"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                  error={nameInputError}
                  helperText={
                    nameInputError ? "O nome não pode estar vazio" : null
                  }
                  required
                />
                <Select
                  label="Tipo de Documento"
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  options={[
                    { label: "CPF", value: "CPF" },
                    { label: "CNPJ", value: "CNPJ" },
                  ]}
                />
              </FormRow>
              <FormRow>
                <Input
                  label="Número do Documento"
                  name="document"
                  value={formData.document}
                  onChange={handleChange}
                  variant="outlined"
                  length={14}
                  error={documentInputError}
                  helperText={
                    documentInputError && formData.documentType === "CPF"
                      ? "CPF inválido"
                      : documentInputError && formData.documentType === "CNPJ"
                      ? "CNPJ inválido"
                      : null
                  }
                  required
                />
              </FormRow>
              <FormRow>
                <Input
                  label="Telefone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  variant="outlined"
                  length={14}
                />

                <Input
                  label="E-mail"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  error={emailInputError}
                  helperText={emailInputError ? "E-mail inválido" : null}
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
                onClick={() => navigate("/producers")}
                style={{ minWidth: "120px", backgroundColor: "#f44336" }}
              />
            </FormActions>
          </Form>
        </ContainerForm>
      </Container>
    </MainLayout>
  );
}
