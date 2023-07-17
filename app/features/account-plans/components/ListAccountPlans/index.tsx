import { useState } from 'react'

import { PlusButton } from '@app/atomic/atoms/PlusButton'
import MoreOptionsMenu from '@app/atomic/molecules/MoreOptionsMenu/MoreOptionsMenu'
import { AccountPlansDrawer } from '@app/atomic/organisms/AccountPlansDrawer'
import { ListRowItem } from '@app/atomic/organisms/ListRowItem'
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
  faPenToSquare,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useDeleteOneAccountPlanMutation } from '../../graphql/mutations.generated'
import { useGetAccountPlansQuery } from '../../graphql/queries.generated'

type costTypeProps = 'INCOME' | 'OUTCOME'

type AccountPlanProps = {
  id: string
  name: string
  accountPlanType: 'FIXED' | 'VARIABLE'
  costType: costTypeProps
}

const ListAccountPlan: React.FC = () => {
  const [search, setSearch] = useState('')

  const handleSearch = (e: any) => {
    setSearch(e.target.value)
  }

  const { data, loading, fetchMore } = useGetAccountPlansQuery({
    variables: { name: `%${search}%` ?? `%%`, limit: 10 },
  })
  const loadMore = async () => {
    const variables = {
      offset: data?.accountPlans?.nodes.length,
      limit: 10,
      namOrEmail: `%${search}%` ?? `%%`,
    }

    try {
      fetchMore({
        variables: variables,
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult

          return {
            accountPlans: {
              ...previousResult.accountPlans,
              nodes: [
                ...previousResult.accountPlans.nodes,
                ...fetchMoreResult.accountPlans.nodes,
              ],
              pageInfo: fetchMoreResult.accountPlans.pageInfo,
            },
          }
        },
      })
    } catch (error) {
      console.log(error)
    }
  }
  const toast = useToast()
  const [DeleteOneAccountPlan] = useDeleteOneAccountPlanMutation({
    refetchQueries: ['getAccountPlans'],
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
  const handleUpdate = (accountPlan: AccountPlanProps) => {
    setInitalValues({
      id: accountPlan.id,
      name: accountPlan.name,
      accountPlanType: accountPlan.accountPlanType,
      costType: accountPlan.costType,
    })
    setIsEditform(true)

    onOpen()
  }

  const costType = (costType: costTypeProps) => {
    switch (costType) {
      case 'INCOME':
        return 'Entrada'
      case 'OUTCOME':
        return 'Saída'
      default:
        break
    }
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
        dataLength={data?.accountPlans?.nodes?.length ?? 0}
        scrollThreshold={1}
        style={{ overflow: 'hidden' }}
        hasMore={data?.accountPlans?.pageInfo?.hasNextPage ?? false}
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
        {data?.accountPlans?.nodes.map(accountPlan => {
          const borderLeftColor =
            accountPlan.costType === 'INCOME' ? '#00B247' : '#D90000'

          return (
            <ListRowItem
              maxW={'95%'}
              key={accountPlan.id}
              boxShadow={'lg'}
              bgColor={'#FFFFFF'}
              templateColumns={[
                '1fr',
                '1fr 1fr 1fr 0.2fr',
                '1fr 1fr 1fr 0.2fr',
              ]}
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
                      onClick: () => handleUpdate(accountPlan),
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
                        DeleteOneAccountPlan({
                          variables: { id: accountPlan.id },
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
              <GridItem>{accountPlan?.name}</GridItem>
              <GridItem display="flex" alignItems="center">
                <Box ml={2}>{costType(accountPlan?.costType)}</Box>
              </GridItem>
              <GridItem></GridItem>
            </ListRowItem>
          )
        })}
      </InfiniteScroll>
      <PlusButton onOpen={onOpen} setEdit={setIsEditform} />
      {isOpen && (
        <AccountPlansDrawer
          intitialValues={initialValues}
          isEditForm={isEditForm}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  )
}

export default ListAccountPlan
