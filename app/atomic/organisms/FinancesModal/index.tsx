import React from 'react'

import { MaskField } from '@app/atomic/molecules/MaskField'
import ModalTemplate from '@app/atomic/molecules/Modal'
import { NumberField } from '@app/atomic/molecules/NumberField'
import { SelectField } from '@app/atomic/molecules/SelectField'
import { TextAreaField } from '@app/atomic/molecules/TextareaField'
import { useGetAccountPlansQuery } from '@app/features/account-plans/graphql/queries.generated'
import useCreateOneFinance, {
  CreateOneFinanceProps,
} from '@app/features/finances/hooks/useCreateOneFinance'
import useUpdateOneFinance from '@app/features/finances/hooks/useUpdateOneFinance'
import { useGetSuppliersAndCustomersQuery } from '@app/features/suppliers-and-customers/graphql/queries.generated'
import { Box, Button } from '@chakra-ui/react'
import { Form } from 'react-final-form'

interface FinancesModalProps {
  isOpen: boolean
  isEditForm?: boolean
  onClose: () => void
  intitialValues?: any | null
}

export const FinancesModal: React.FC<FinancesModalProps> = ({
  isOpen,
  onClose,
  isEditForm,
  intitialValues,
}) => {
  const { CreateOneFinance } = useCreateOneFinance()
  const { updateOneFiance } = useUpdateOneFinance()
  const { data: suppliersAndCustomersData } =
    useGetSuppliersAndCustomersQuery({
      fetchPolicy: 'no-cache',
    })
  const { data: accountPlanData } = useGetAccountPlansQuery({
    fetchPolicy: 'no-cache',
  })

  const suppliersAndCustomers =
    suppliersAndCustomersData?.suppliersAndCustomers?.nodes
  const accountPlans = accountPlanData?.accountPlans?.nodes

  const handleUpdate = values => {
    values.id = intitialValues.id
    updateOneFiance(values)
  }

  const statusOptions = [
    { value: 'OPEN', label: 'Aberto' },
    { value: 'PAID', label: 'Pago' },
  ]

  return (
    <Form
      onSubmit={values => {
        isEditForm
          ? handleUpdate(values)
          : CreateOneFinance(values as CreateOneFinanceProps)
      }}
      initialValues={isEditForm ? intitialValues : null}
    >
      {({ handleSubmit, hasValidationErrors, form }) => {
        return (
          <ModalTemplate
            size="6xl"
            isOpen={isOpen}
            onClose={() => {
              onClose()
              form.reset()
            }}
            title={
              isEditForm
                ? 'Editar Lançamento'
                : 'Cadastrar Lançamento'
            }
            footer={
              <>
                <Button
                  variant="outline"
                  mr={3}
                  onClick={() => {
                    onClose()
                    form.reset()
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  disabled={hasValidationErrors}
                  onClick={values => {
                    handleSubmit(values)
                    onClose()
                    form.reset()
                  }}
                  type="submit"
                  colorScheme="blue"
                >
                  Salvar
                </Button>
              </>
            }
          >
            <Box
              display="flex"
              flexDir="column"
              gap={5}
              alignItems="center"
              pt={10}
              mb={5}
              h="70vh"
            >
              <Box display="flex" flexDir="column" w="75%" gap={5}>
                <Box display="flex" gap={10}>
                  <SelectField
                    isRequired
                    name="supplierAndCustomerId"
                    validate="string"
                    label="Fornecedor / Cliente"
                    placeholder="Selecione"
                  >
                    {suppliersAndCustomers?.map(
                      (suppliAndCustomer, index) => (
                        <option
                          key={index}
                          value={suppliAndCustomer.id}
                        >
                          {suppliAndCustomer.name}
                        </option>
                      ),
                    )}
                  </SelectField>
                  <SelectField
                    isRequired
                    name="accountplanId"
                    validate="string"
                    label="Plano de Conta"
                    placeholder="Selecione"
                  >
                    {accountPlans?.map((accountPlan, index) => (
                      <option key={index} value={accountPlan.id}>
                        {accountPlan.name}
                      </option>
                    ))}
                  </SelectField>
                </Box>
                <Box display="flex" gap={10}>
                  <MaskField
                    mask="00/00/0000"
                    name="issuedate"
                    label="Data de Emissão"
                    validate="string|min:10"
                    isRequired
                    useMaskFormat
                    inputProps={{
                      placeholder: '__/__/____',
                    }}
                  />
                  <MaskField
                    mask="00/00/0000"
                    name="paymentTerm"
                    label="Prazo de Pagamento"
                    validate="string|min:10"
                    isRequired
                    useMaskFormat
                    inputProps={{
                      placeholder: '__/__/____',
                    }}
                  />
                </Box>
                <Box display="flex" gap={10}>
                  <MaskField
                    mask="00/00/0000"
                    name="dueDate"
                    label="Data de Vencimento"
                    validate="string|min:10"
                    isRequired
                    useMaskFormat
                    inputProps={{
                      placeholder: '__/__/____',
                    }}
                  />
                  <SelectField
                    isRequired
                    name="status"
                    validate="string"
                    label="Status"
                    placeholder="Selecione"
                  >
                    {statusOptions?.map((status, index) => (
                      <option key={index} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </SelectField>
                </Box>
                <Box display="flex" gap={10} mb={10}>
                  <MaskField
                    mask="00/00/0000"
                    name="payDay"
                    label="Data de Pagamento"
                    useMaskFormat
                    inputProps={{
                      placeholder: '__/__/____',
                    }}
                  />
                  <NumberField
                    name="value"
                    label="Valor"
                    isRequired
                    validate="number"
                  />
                </Box>
                <TextAreaField name="comments" label="comentário" />
              </Box>
            </Box>
          </ModalTemplate>
        )
      }}
    </Form>
  )
}
