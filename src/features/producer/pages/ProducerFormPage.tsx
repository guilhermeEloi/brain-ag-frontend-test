import { useEffect, useState } from "react";

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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { mockProducers } from "@/services/mocks/producerData";

export default function ProducerFormPage() {
  const [formData, setFormData] = useState<ProducerForm>({
    name: "",
    document: "",
    phone: "",
    email: "",
    documentType: "CPF",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [nameInputError, setNameInputError] = useState<boolean>(false);
  const [documentInputError, setDocumentInputError] = useState<boolean>(false);
  const [emailInputError, setEmailInputError] = useState<boolean>(false);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

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
      toast.error("O nome do produtor não pode estar vazio");
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

    if (isEditing) {
      toast.success("Produtor editado!");
      console.log("Editando produtor:", formData);
    } else {
      toast.success("Produtor cadastrado!");
      console.log("Criando produtor:", formData);
    }
  };

  useEffect(() => {
    if (id) {
      const idNumber = Number(id);
      setIsEditing(true);
      const producer = mockProducers.find((p) => p.id === idNumber);
      if (producer) {
        setFormData({
          name: producer.name,
          document: producer.document,
          phone: producer.phone || "",
          email: producer.email || "",
          documentType: producer.documentType || "CPF",
        });
      }
    }
  }, [id]);

  return (
    <MainLayout>
      <PageTitle>Cadastrar Novo Produtor</PageTitle>
      <Container>
        <ContainerForm>
          <Form onSubmit={handleSubmit}>
            <div>
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
                  helperText={emailInputError ? "Email inválido" : null}
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
                style={{ minWidth: "120px", backgroundColor: "	#f44336" }}
              />
            </FormActions>
          </Form>
        </ContainerForm>
      </Container>
    </MainLayout>
  );
}
