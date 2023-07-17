import { useState } from 'react'

import { PlusButton } from '@app/atomic/atoms/PlusButton'
import MoreOptionsMenu from '@app/atomic/molecules/MoreOptionsMenu/MoreOptionsMenu'
import { ListRowItem } from '@app/atomic/organisms/ListRowItem'
import { SuppliersAndCustomersDrawer } from '@app/atomic/organisms/SupplersAndCustomersDrawer'
import { SuppliersAndCustomer } from '@app/generated/graphql'
import {
  Box,
  Flex,
  GridItem,
  Input,
  Spinner,
  Stack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import {
  faEnvelope,
  faPenToSquare,
  faSquarePhone,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useDeleteOneSuppliersAndCustomerMutation } from '../../graphql/mutations.generated'
import { useGetSuppliersAndCustomersQuery } from '../../graphql/queries.generated'

const ListSupplyAndCustomer: React.FC = () => {
  const [search, setSearch] = useState('')

  const handleSearch = (e: any) => {
    setSearch(e.target.value)
  }

  const { data, loading, fetchMore } =
    useGetSuppliersAndCustomersQuery({
      variables: { namOrEmail: `%${search}%` ?? `%%`, limit: 10 },
    })

  const loadMore = async () => {
    const variables = {
      offset: data?.suppliersAndCustomers?.nodes.length,
      limit: 10,
      namOrEmail: `%${search}%` ?? `%%`,
    }

    try {
      fetchMore({
        variables: variables,
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult

          return {
            suppliersAndCustomers: {
              ...previousResult.suppliersAndCustomers,
              nodes: [
                ...previousResult.suppliersAndCustomers.nodes,
                ...fetchMoreResult.suppliersAndCustomers.nodes,
              ],
              pageInfo:
                fetchMoreResult.suppliersAndCustomers.pageInfo,
            },
          }
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

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
  }

  return (
    <>
      <Stack spacing={3}>
        <Input
          backgroundColor="white"
          maxWidth="400px"
          placeholder="Pesquisar"
          boxShadow={'lg'}
          size="lg"
          onChange={e => handleSearch(e)}
        />
      </Stack>

      {/* <Button disabled={isFetchingMore || loading} onClick={loadMore}>
        loadmore
      </Button> */}

      {loading && (
        <Flex
          width="100%"
          height="100%"
          justify="center"
          alignItems="center"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      )}
      <InfiniteScroll
        scrollableTarget="scrollableDiv"
        dataLength={data?.suppliersAndCustomers?.nodes?.length ?? 0}
        scrollThreshold={1}
        style={{ overflow: 'hidden' }}
        hasMore={
          data?.suppliersAndCustomers?.pageInfo?.hasNextPage ?? false
        }
        next={loadMore}
        loader={
          <Flex
            width="100%"
            height="25px"
            justify="center"
            alignItems="center"
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Flex>
        }
      >
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
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        size="lg"
                      />
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
      </InfiniteScroll>
      <PlusButton onOpen={onOpen} setEdit={setIsEditform} />
      {isOpen && (
        <SuppliersAndCustomersDrawer
          intitialValues={initialValues}
          isEditForm={isEditForm}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  )
}

export default ListSupplyAndCustomer
