import { useState } from 'react'

import { PlusButton } from '@app/atomic/atoms/PlusButton'
import MoreOptionsMenu from '@app/atomic/molecules/MoreOptionsMenu/MoreOptionsMenu'
import { FinancesModal } from '@app/atomic/organisms/FinancesModal'
import { ListRowItem } from '@app/atomic/organisms/ListRowItem'
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
  faCalendarXmark,
  faCircleExclamation,
  faHourglassStart,
  faPenToSquare,
  faRepeat,
  faSquareCheck,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { addDays, compareAsc, format, startOfDay } from 'date-fns'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useDeleteOneFinanceMutation } from '../../graphql/mutations.generated'
import { useGetFinancesQuery } from '../../graphql/queries.generated'

type ListFinancesProps = {
  id: string
  comments?: string
  dueDate: Date
  issuedate: string
  payDay?: Date
  paymentTerm: Date
  status: 'OPEN' | 'PAID'
  value: number
  createdAt: Date
  updatedAt: Date
  accountplan?: {
    id: string
    accountPlanType: 'FIXED' | 'VARIABLE'
    costType: 'INCOME' | 'OUTCOME'
    name: string
  }
  supplierAndCustomer?: SuppliersAndCustomer
}

const ListFinances: React.FC = () => {
  const [search, setSearch] = useState('')

  const handleSearch = (e: any) => {
    setSearch(e.target.value)
  }

  const { data, loading, fetchMore } = useGetFinancesQuery({
    variables: { nameOrEmail: `%${search}%` ?? `%%`, limit: 10 },
  })

  const toast = useToast()

  const loadMore = async () => {
    const variables = {
      offset: data?.finances?.nodes.length,
      limit: 10,
      nameOrEmail: `%${search}%` ?? `%%`,
    }
    try {
      fetchMore({
        variables: variables,
        // @ts-ignore
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult

          return {
            finances: {
              ...previousResult.finances,
              nodes: [
                ...previousResult.finances.nodes,
                ...fetchMoreResult.finances.nodes,
              ],
              pageInfo: fetchMoreResult.finances.pageInfo,
            },
          }
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  const [DeleteOneFinance] = useDeleteOneFinanceMutation({
    refetchQueries: ['getFinances'],
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
  const [initialValues, setInitalValues] = useState<any | null>(null)
  const [isEditForm, setIsEditform] = useState(false)
  const handleUpdate = (finance: ListFinancesProps) => {
    const formatedDueDate = format(
      addDays(new Date(finance.dueDate), 1),
      'dd/MM/yyyy',
    )
    const formatedIssuedate = format(
      addDays(new Date(finance.issuedate), 1),
      'dd/MM/yyyy',
    )
    const formatedPaymentTerm = format(
      addDays(new Date(finance.paymentTerm), 1),
      'dd/MM/yyyy',
    )
    let formatedPayDay
    if (finance.payDay) {
      formatedPayDay = format(
        addDays(new Date(finance.payDay), 1),
        'dd/MM/yyyy',
      )
    }

    setInitalValues({
      id: finance.id,
      accountplanId: finance?.accountplan?.id,
      dueDate: formatedDueDate,
      issuedate: formatedIssuedate,
      paymentTerm: formatedPaymentTerm,
      payDay: formatedPayDay,
      status: finance.status,
      supplierAndCustomerId: finance?.supplierAndCustomer?.id,
      value: `${finance.value}`,
      comments: finance.comments,
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
          size="lg"
          onChange={e => handleSearch(e)}
        />
      </Stack>

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
        dataLength={data?.finances?.nodes?.length ?? 0}
        scrollThreshold={1}
        style={{ overflow: 'hidden' }}
        hasMore={data?.finances?.pageInfo?.hasNextPage ?? false}
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
        {data?.finances?.nodes?.map(finance => {
          const compareDate = compareAsc(
            startOfDay(addDays(new Date(finance?.dueDate), 1)),
            startOfDay(new Date()),
          )
          const isLate =
            compareDate === -1 && finance?.status === 'OPEN'

          const borderLeftColor = isLate ? '#D90000' : '#00B247'

          const issueDate = format(
            addDays(new Date(finance?.issuedate), 1),
            'dd/MM/yyyy',
          )
          const dueDate = format(
            addDays(new Date(finance?.dueDate), 1),
            'dd/MM/yyyy',
          )

          const status = () => {
            if (isLate) {
              return {
                icon: faCircleExclamation,
                color: '#D90000',
              }
            } else if (
              compareDate !== -1 &&
              finance.status === 'PAID'
            ) {
              return {
                icon: faSquareCheck,
                color: '#00B247',
              }
            } else {
              return {
                icon: faHourglassStart,
                color: '#00B247',
              }
            }
          }

          return (
            <ListRowItem
              maxW={'95%'}
              key={finance.id}
              boxShadow={'lg'}
              bgColor={'#FFFFFF'}
              templateColumns={['1fr', '1.5fr 3fr 1fr min-content']}
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
                      // @ts-ignore
                      onClick: () => handleUpdate(finance),
                    },
                    {
                      icon: (
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          size="lg"
                        />
                      ),
                      label: 'Excluir',
                      onClick: () =>
                        DeleteOneFinance({
                          variables: { id: finance.id },
                        }),
                    },
                  ]}
                />
              }
              actionsProps={{ justifySelf: 'flex-end' }}
              borderLeft="8px"
              borderLeftColor={borderLeftColor}
              my={5}
            >
              <GridItem>
                {finance?.supplierAndCustomer?.name}
              </GridItem>
              <GridItem display="flex" alignItems="center">
                <Box ml={2} mr={3}>{`Emissão: ${issueDate}`}</Box>
                <FontAwesomeIcon icon={faCalendarXmark} size="lg" />
                <Box ml={10} mr={3}>{`Vencimento: ${dueDate}`}</Box>
                <FontAwesomeIcon icon={faCalendarXmark} size="lg" />
              </GridItem>
              <GridItem
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>{`R$: ${finance?.value?.toFixed(2)}`}</Box>
                <FontAwesomeIcon icon={faRepeat} size="lg" />
                <FontAwesomeIcon
                  icon={status()?.icon}
                  color={status()?.color}
                  size="lg"
                />
              </GridItem>
            </ListRowItem>
          )
        })}
      </InfiniteScroll>
      <PlusButton onOpen={onOpen} setEdit={setIsEditform} />
      {isOpen && (
        <FinancesModal
          isOpen={isOpen}
          onClose={onClose}
          intitialValues={initialValues}
          isEditForm={isEditForm}
        />
      )}
    </>
  )
}

export default ListFinances
