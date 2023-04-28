import { useTable, usePagination, type Column } from "react-table";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Text,
  Tooltip,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  TableContainer,
} from "@chakra-ui/react";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@chakra-ui/icons";
import { useMemo, useState, useEffect, useCallback } from "react";

export interface PaginatedData {
  data: object[];
  page: number;
  perPage: number;
  total: number;
}
export interface TableProps {
  columns: Column[];
  getData: (page: number, perPage: number) => Promise<PaginatedData>;
}

const CustomTable = (props: TableProps) => {
  const { columns, getData } = props;

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const [_data, setData] = useState<PaginatedData>({
    data: [],
    page: 0,
    perPage: 10,
    total: 0,
  });

  const fetchData = useCallback(async () => {
    const data = await getData(pageIndex, pageSize);
    setData(data);
  }, [getData, pageIndex, pageSize]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const data = useMemo(() => _data, [_data]);

  const instance = useTable(
    {
      columns,
      data: data.data,
      state: {
        pagination,
      },
      onPaginationChange: setPagination,
    },
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = instance;
  return (
    <>
      <TableContainer rounded={"md"}>
        <Table {...getTableProps()} variant="striped">
          <Thead bg="blue.05">
            {headerGroups.map((headerGroup, i) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={`col-${i}`}>
                {headerGroup.headers.map((column, j) => (
                  <Th
                    {...column.getHeaderProps()}
                    color="white"
                    key={`col-header-${j}`}
                  >
                    {column.render("Header")}
                  </Th>
                ))}
                <Th color="white">Actions</Th>
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={`row-${i}`}>
                  {row.cells.map((cell, j) => (
                    <Td {...cell.getCellProps()} key={`cell-${j}`}>
                      {cell.render("Cell")}
                    </Td>
                  ))}
                  <Td>View details</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex flexDirection={"row-reverse"}>
        <Text flexShrink="0" color="text.third" mt={3}>
          Showing{" "}
          <Text as="span">
            {pageIndex * pageSize + 1}
            {"-"}
            {Math.min((pageIndex + 1) * pageSize, data?.total)}
          </Text>{" "}
          of <Text as="span">{data?.total}</Text>
        </Text>
      </Flex>
      <Flex justifyContent="space-between" m={4} alignItems="center">
        <Flex>
          <Tooltip label="First Page">
            <IconButton
              aria-label="First Page"
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              aria-label="Previous Page"
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>
        <Flex alignItems="center">
          <Text flexShrink="0">Go to page:</Text>{" "}
          <NumberInput
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={pageOptions.length}
            onChange={(value) => {
              const v = parseInt(value);
              const page = v ? v - 1 : 0;
              gotoPage(page);
            }}
            defaultValue={pageIndex}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            w={32}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex>
          <Tooltip label="Next Page">
            <IconButton
              aria-label="Next Page"
              onClick={nextPage}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              aria-label="Last Page"
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
              ml={4}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </>
  );
};

export default CustomTable;
