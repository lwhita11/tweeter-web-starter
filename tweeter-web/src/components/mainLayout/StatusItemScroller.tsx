import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import Post from "../statusItem/Post";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import useNavigator from "../appNavbar/NavigationHook";

export const PAGE_SIZE = 10;

interface Props {
    itemDescription: string;
    loadMore: (
        pageSize: number,
        lastItem: Status | null
      ) =>Promise<[Status[], boolean]>
}

const StatusItemScroller = (props: Props) => {
    const { displayErrorMessage } = useToastListener();
    const [items, setItems] = useState<Status[]>([]);
    const [newItems, setNewItems] = useState<Status[]>([]);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [lastItem, setLastItem] = useState<Status | null>(null);
    const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);
  
    const addItems = (newItems: Status[]) =>
      setNewItems(newItems);
    
    const { displayedUser, setDisplayedUser, currentUser, authToken } =
    useUserInfo();
  
    // Initialize the component whenever the displayed user changes
    useEffect(() => {
      reset();
    }, [displayedUser]);
  
    // Load initial items whenever the displayed user changes. Done in a separate useEffect hook so the changes from reset will be visible.
    useEffect(() => {
      if(changedDisplayedUser) {
        loadMoreItems();
      }
    }, [changedDisplayedUser]);
  
    // Add new items whenever there are new items to add
    useEffect(() => {
      if(newItems) {
        setItems([...items, ...newItems]);
      }
    }, [newItems])
  
    const reset = async () => {
      setItems([]);
      setNewItems([]);
      setLastItem(null);
      setHasMoreItems(true);
      setChangedDisplayedUser(true);
    }
  
    const loadMoreItems = async () => {
      try {
        const [newItems, hasMore] = await props.loadMore(
          PAGE_SIZE,
          lastItem
        );
  
        setHasMoreItems(hasMore);
        setLastItem(newItems[newItems.length - 1]);
        addItems(newItems);
        setChangedDisplayedUser(false)
      } catch (error) {
        displayErrorMessage(
          `Failed to load ${props.itemDescription} items because of exception: ${error}`
        );
      }
    };

    return (
        <div className="container px-0 overflow-visible vh-100">
          <InfiniteScroll
            className="pr-0 mr-0"
            dataLength={items.length}
            next={loadMoreItems}
            hasMore={hasMoreItems}
            loader={<h4>Loading...</h4>}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="row mb-3 mx-0 px-0 border rounded bg-white"
              >
                <div className="col bg-light mx-0 px-0">
                  <div className="container px-0">
                    <div className="row mx-0 px-0">
                      <div className="col-auto p-3">
                        <img
                          src={item.user.imageUrl}
                          className="img-fluid"
                          width="80"
                          alt="Posting user"
                        />
                      </div>
                      <div className="col">
                        <h2>
                          <b>
                            {item.user.firstName} {item.user.lastName}
                          </b>{" "}
                          -{" "}
                          <Link
                            to={item.user.alias}
                            onClick={useNavigator().navigateToUser}
                          >
                            {item.user.alias}
                          </Link>
                        </h2>
                        {item.formattedDate}
                        <br />
                        <Post status={item} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      );
}

export default StatusItemScroller;

