import { Title, Group } from "@mantine/core";
import ToggleButton from "./ToggleButton";
const OrderFilter = ({ orderBy, setOrderBy }) => {
  return (
    <>
      <Title
        order={3}
        align="center"
        style={{ marginTop: "10px", marginBottom: "10px" }}
      >
        Sort By
      </Title>
      <Group position="center">
        <ToggleButton
          text="Name"
          setOrder={setOrderBy}
          orderText="name"
          currentOrder={orderBy}
        />
        <ToggleButton
          text="Rating"
          setOrder={setOrderBy}
          orderText="rating"
          currentOrder={orderBy}
        />
        <ToggleButton
          text="Translated Chapters"
          setOrder={setOrderBy}
          orderText="num_of_chaps"
          currentOrder={orderBy}
        />
        <ToggleButton
          text="Added Date"
          setOrder={setOrderBy}
          orderText="created_at"
          currentOrder={orderBy}
        />
        <ToggleButton
          text="Chapters"
          setOrder={setOrderBy}
          orderText="numOfChaps"
          currentOrder={orderBy}
        />
      </Group>
      <Title
        order={3}
        align="center"
        style={{ marginTop: "10px", marginBottom: "10px" }}
      >
        Sort By Views
      </Title>
      <Group position="center">
        <ToggleButton
          text="Total"
          setOrder={setOrderBy}
          orderText="total_views"
          currentOrder={orderBy}
        />
        <ToggleButton
          text="Weekly"
          setOrder={setOrderBy}
          orderText="weekly_views"
          currentOrder={orderBy}
        />
        <ToggleButton
          text="Monthly"
          setOrder={setOrderBy}
          orderText="monthly_views"
          currentOrder={orderBy}
        />
        <ToggleButton
          text="Yearly"
          setOrder={setOrderBy}
          orderText="yearly_views"
          currentOrder={orderBy}
        />
      </Group>
    </>
  );
};

export default OrderFilter;
