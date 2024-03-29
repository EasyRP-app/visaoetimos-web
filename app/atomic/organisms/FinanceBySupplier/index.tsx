import React from 'react'

import { Spinner } from '@chakra-ui/react'
import { Box, Flex, Text } from '@chakra-ui/react'
import dynamic from 'next/dynamic'

const Pie = dynamic(
  () => import('@ant-design/charts').then(mod => mod.Pie as any),
  { ssr: false },
) as any

interface FinanceBySupplierProps {
  queryData?: any
  isLoading?: boolean
  title?: string
}

const FinanceBySupplier = ({
  queryData,
  isLoading,
  title,
}: FinanceBySupplierProps) => {
  const DemoPie = () => {
    const config = {
      appendPadding: 10,
      data: queryData || [],
      angleField: 'value',
      colorField: 'type',
      radius: 1,
      innerRadius: 0.64,
      // meta: {
      // value: {
      //   formatter: v => `R$ ${v}`,
      // },
      // },
      label: {
        type: 'inner',
        offset: '-50%',
        style: {
          textAlign: 'center',
        },
        autoRotate: false,
        content: '{value}',
      },
      statistic: {
        title: {
          offsetY: -4,
        },
        content: {
          offsetY: 4,
          style: {
            fontSize: '32px',
          },
        },
      },
      interactions: [
        {
          type: 'element-selected',
        },
        {
          type: 'element-active',
        },
        {
          type: 'pie-statistic-active',
        },
      ],
    }

    return <Pie {...config} />
  }

  return (
    <Box backgroundColor="white" borderRadius="5px">
      <Text fontSize="24px" pl="20px" pt="5px" fontWeight="bold">
        {title}
      </Text>
      {isLoading ? (
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
      ) : (
        <Box marginLeft="auto" marginRight="auto" width="min-content">
          <DemoPie></DemoPie>
        </Box>
      )}
    </Box>
  )
}

export default FinanceBySupplier
