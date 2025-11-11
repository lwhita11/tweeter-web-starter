import { Status } from "tweeter-shared";
import StatusItem from "../statusItem/StatusItem";
import { StatusItemPresenter } from "../../presenter/StatusItemPresenter";
import { StatusService } from "../../model.service/StatusService";
import { PagedItemView } from "../../presenter/PagedItemPresenter";
import { ItemScroller } from "./PagedItemScroller";

interface Props {
  featureUrl: string;
  presenterFactory: (listener: PagedItemView<Status>) => StatusItemPresenter;
}

export default function StatusItemScroller({
  featureUrl,
  presenterFactory,
}: Props) {
  return (
    <ItemScroller<Status, StatusService, StatusItemPresenter>
      featureUrl={featureUrl}
      presenterFactory={presenterFactory}
      renderItem={(status, featureUrl, index) => (
        <StatusItem key={index} status={status} featureUrl={featureUrl} />
      )}
    />
  );
}
