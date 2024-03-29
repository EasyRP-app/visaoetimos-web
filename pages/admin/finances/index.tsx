import LayoutTemplate from '@app/atomic/templates/LayoutTemplate'
import ListFinances from '@app/features/finances/components/ListFinances'
import { Box } from '@chakra-ui/react'

const Finances = () => {
  return (
    <LayoutTemplate>
      <Box margin={5}>
        <Box fontSize="24px" fontWeight="bold" pb="6px">
          Finanças
        </Box>
        <ListFinances />
      </Box>
    </LayoutTemplate>
  )
}

export default Finances
