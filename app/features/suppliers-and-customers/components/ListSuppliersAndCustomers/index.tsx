import { useState } from 'react'

import {
  Box,
  Button,
  GridItem,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import {
  faEnvelope,
  faPenToSquare,
  faPlus,
  faSquarePhone,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import MoreOptionsMenu from '../../../../atomic/molecules/moreOptionsMenu/MoreOptionsMenu'
import { SuppliersAndCustomersDrawer } from '../../../../atomic/organisms/AddsSupplersAndCustomersDrawer'
import { ListRowItem } from '../../../../atomic/organisms/ListRowItem'
import { SuppliersAndCustomer } from '../../../../generated/graphql'
import { useDeleteOneSuppliersAndCustomerMutation } from '../../graphql/mutations.generated'
import { useGetSuppliersAndCustomersQuery } from '../../graphql/suppliers-and-customers.generated'

const ListSupplyAndCustomer: React.FC = () => {
  const { data } = useGetSuppliersAndCustomersQuery()
  const toast = useToast()
  const [DeleteSupplierAndCustomer] =
    useDeleteOneSuppliersAndCustomerMutation({
      refetchQueries: ['getSuppliersAndCustomers'],
      onCompleted: () => {
        toast({
          title: 'Sucesso!',
          description: 'Deletado com Sucesso',
          status: 'success',
          position: 'top-right',
          variant: 'top-accent',
          isClosable: true,
        })
      },
    })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [initialValues, setInitalValues] =
    useState<SuppliersAndCustomer | null>(null)
  const [isEditForm, setIsEditform] = useState(false)
  const handleUpdate = (supply: SuppliersAndCustomer) => {
    setInitalValues({
      id: supply.id,
      address: supply.address,
      cpf: supply.cpf,
      phone: supply.phone,
      email: supply.email,
      name: supply.name,
    })
    setIsEditform(true)

    onOpen()
    console.log(supply)
  }

  return (
    <>
      {data?.suppliersAndCustomers?.nodes.map(supply => (
        <ListRowItem
          maxW={'95%'}
          key={supply.id}
          boxShadow={'lg'}
          bgColor={'#FFFFFF'}
          actions={
            <MoreOptionsMenu
              options={[
                {
                  icon: (
                    <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                  ),
                  label: 'Editar',
                  onClick: () => handleUpdate(supply),
                },
                {
                  icon: (
                    <FontAwesomeIcon icon={faTrashCan} size="lg" />
                  ),
                  label: 'Excluir',
                  onClick: () =>
                    DeleteSupplierAndCustomer({
                      variables: { id: supply.id },
                    }),
                },
              ]}
            />
          }
          actionsProps={{ justifySelf: 'flex-end' }}
          borderLeft="8px"
          borderLeftColor="#00B247"
          my={5}
        >
          <GridItem>{supply?.name}</GridItem>
          <GridItem display="flex" alignItems="center">
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
            <Box ml={2}>{supply?.email}</Box>
          </GridItem>
          <GridItem display="flex" alignItems="center">
            <FontAwesomeIcon
              icon={faSquarePhone}
              size="lg"
              color="#00B247"
            />
            <Box ml={2}>{supply?.phone}</Box>
          </GridItem>
        </ListRowItem>
      ))}
      <Button
        width="56px"
        height="56px"
        borderRadius="50%"
        position="absolute"
        bottom={10}
        right={10}
        colorScheme="teal"
        onClick={() => {
          onOpen()
          setIsEditform(false)
        }}
      >
        <FontAwesomeIcon size="lg" icon={faPlus} />
      </Button>
      <SuppliersAndCustomersDrawer
        intitialValues={initialValues}
        isEditForm={isEditForm}
        isOpen={isOpen}
        onClose={onClose}
      ></SuppliersAndCustomersDrawer>
    </>
  )
}

export default ListSupplyAndCustomer