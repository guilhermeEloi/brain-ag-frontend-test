import { useState } from "react";

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
  maskEmail,
} from "@/utils";

import { PageTitle } from "../styles/stylesProducerListPage";
import {
  Container,
  ContainerForm,
  Form,
  FormActions,
  FormRow,
} from "../styles/stylesProducerFormPage";
import { useNavigate } from "react-router-dom";

export default function ProducerFormPage() {
  const [formData, setFormData] = useState<ProducerForm>({
    name: "",
    document: "",
    phone: "",
    email: "",
    documentType: "CPF",
  });

  const navigate = useNavigate();

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name?: string; value: unknown } }
  ) => {
    const name = e.target.name || "";
    let value = e.target.value as string;

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

    if (name === "email") {
      value = maskEmail(value);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const onlyNumbers = (str: string) => str.replace(/\D/g, "");

    if (
      formData.documentType === "CPF" &&
      !isValidCPF(onlyNumbers(formData.document))
    ) {
      alert("CPF inválido");
      return;
    }

    if (
      formData.documentType === "CNPJ" &&
      !isValidCNPJ(onlyNumbers(formData.document))
    ) {
      alert("CNPJ inválido");
      return;
    }

    if (formData.email && !isValidEmail(formData.email)) {
      alert("Email inválido");
      return;
    }

    console.log("Dados do produtor:", formData);
  };

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
                />

                <Input
                  label="E-mail"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                />
              </FormRow>
            </div>
            <FormActions>
              <FormButton
                type="submit"
                variant="contained"
                label="Cadastrar"
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
