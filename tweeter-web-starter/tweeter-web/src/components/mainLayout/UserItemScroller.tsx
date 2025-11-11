import { User } from "tweeter-shared";
import UserItem from "../userItem/UserItem";
import { UserItemPresenter } from "../../presenter/UserItemPresenter";
import { UserService } from "../../model.service/UserService";
import { PagedItemView } from "../../presenter/PagedItemPresenter";
import { ItemScroller } from "./PagedItemScroller";
import { FollowService } from "../../model.service/FollowService";

interface Props {
  featureUrl: string;
  presenterFactory: (listener: PagedItemView<User>) => UserItemPresenter;
}

export default function UserItemScroller({
  featureUrl,
  presenterFactory,
}: Props) {
  return (
    <ItemScroller<User, FollowService, UserItemPresenter>
      featureUrl={featureUrl}
      presenterFactory={presenterFactory}
      renderItem={(user, featureUrl, index) => (
        <UserItem key={index} user={user} featurePath={featureUrl} />
      )}
    />
  );
}
