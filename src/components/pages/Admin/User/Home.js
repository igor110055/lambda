import React from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { FaCheck, FaTrash } from "react-icons/fa";

import Container from "../../../atoms/Container";
import Text from "../../../atoms/Text";

import { SettingsHeading, SettingsItem } from "../../../molecules/SettingsItem";
import ProfilePic from "../../../molecules/ProfilePic";

import ConfirmationModal from "../../../organisms/ConfirmationModal";

import { useProfile } from "../../../../hooks/useProfile";
import { useAdminUser, useAdminUsers } from "../../../../hooks/useUsers";
import { useMultipleConfirmation } from "../../../../hooks/useMultipleConfirmation";

import axiosInstance from "../../../../utils/axios";
import {
  capitalise,
  convertDate,
  formatPhoneNumber,
} from "../../../../utils/formatText";

import { AdminDisplay } from "../common/AdminChecker";

const Home = () => {
  const { url } = useRouteMatch();
  const { userId } = useParams();
  const history = useHistory();

  const { profile } = useProfile();
  const { user, mutate } = useAdminUser(userId);
  const { mutate: mutateUsers } = useAdminUsers();

  const ownAccount = user.email === profile.email;

  const {
    open,
    close,
    show,
    title,
    message,
    callback,
  } = useMultipleConfirmation();

  const verifyEmail = async () => {
    const title = "Verify Email Manually";
    const message =
      "Manually verify email if user is having trouble verifying their email";
    open(title, message, async () => {
      try {
        await axiosInstance.put("/users/" + user._id, {
          meta: {
            ...user.meta,
            isEmailVerified: true,
          },
        });
        mutate();
      } catch (err) {
        // console.log(err.response);
      }
    });
  };

  const toggleActive = async () => {
    const title = user.meta.isActive ? "Deactivate User" : "Rectivate User";
    const message = user.meta.isActive
      ? "This user would no longer be able to log into their account"
      : "This user would regain access to their account";
    open(title, message, async () => {
      try {
        await axiosInstance.put("/users/" + user._id, {
          meta: {
            ...user.meta,
            isActive: !user.meta.isActive,
          },
        });
        mutate();
      } catch (err) {
        // console.log(err.response);
      }
    });
  };

  const toggleRestriction = async () => {
    const title = user.meta.isRestricted
      ? "Remove Restriction"
      : "Restricte Account";
    const message = user.meta.isRestricted
      ? "This user would be able to make transactions on their account"
      : "This user would no longer be able to make transactions on their account";
    open(title, message, async () => {
      try {
        await axiosInstance.put("/users/" + user._id, {
          meta: {
            ...user.meta,
            isRestricted: !user.meta.isRestricted,
          },
        });
        mutate();
      } catch (err) {
        // console.log(err.response);
      }
    });
  };

  const deleteUser = async () => {
    const title = "Delete User";
    const message =
      "This user account would be deleted permanently. Are you sure you want to continue?";
    open(title, message, async () => {
      try {
        await axiosInstance.delete("/users/" + user._id);
        mutateUsers();
        history.push("/dashboard/admin/users");
      } catch (err) {
        // console.log(err.response);
      }
    });
  };

  const bankWithdrawal =
    process.env.REACT_APP_BANK_WITHDRAWAL?.toLowerCase() === "true";

  return (
    <Container p="12px 0" wide>
      <Container flexCol="center" p="12px" wide>
        <ProfilePic size="64px" user={user} />
        <Text font="12px" p="12px 0 4px" bold>
          {user.fullName}
        </Text>
      </Container>

      <Container p="12px" wide>
        <SettingsHeading heading="Manage User" />
        <SettingsItem
          title="Wallets and Balances"
          body="View user balances and manage custom wallet addresses"
          to={`${url}/wallets`}
        />
        <SettingsItem
          title="Transactions"
          body="Add and Manage user transactions"
          to={`${url}/transactions`}
        />
        <SettingsItem
          title="Messages"
          body="Add and Manage user messages"
          to={`${url}/messages`}
        />
        <SettingsItem
          title="Payments"
          body="Add and Manage user payments"
          to={`${url}/payments`}
        />
        <SettingsItem
          title="Cards"
          body="Add and Manage user cards"
          to={`${url}/cards`}
        />
        {bankWithdrawal && (
          <SettingsItem
            title="Banks"
            body="Add and Manage user banks"
            to={`${url}/banks`}
          />
        )}
        <SettingsItem
          title="Send Email"
          body="Send email to user's email address"
          to={`${url}/email`}
        />
      </Container>

      <Container p="12px" wide>
        <SettingsHeading heading="Account Settings" />
        <SettingsItem
          title="Account Information"
          body="View user account information, manage user documents and upgrade user account"
          to={`${url}/account`}
        />
        <AdminDisplay>
          {!user.meta.isEmailVerified && (
            <SettingsItem
              title="Verify Email Manually"
              body="Verify user email if user is having trouble verifying"
              color="actionBg"
              opacity="1"
              icon={<FaCheck />}
              onClick={verifyEmail}
            />
          )}
          <SettingsItem
            title={
              user.meta.isRestricted ? "Remove Restriction" : "Restrict Account"
            }
            body="Restrict account to prevent users from making transactions"
            detail
            onClick={toggleRestriction}
          />
          {!ownAccount && (
            <>
              <SettingsItem
                title={user.meta.isActive ? "Deactivate" : "Reactivate"}
                body="Disabled users can no longer login or access their account"
                detail
                onClick={toggleActive}
              />
              <SettingsItem
                title="Delete Account"
                body="Delete this account permanently"
                color="danger"
                opacity="1"
                icon={<FaTrash />}
                onClick={deleteUser}
              />
            </>
          )}
        </AdminDisplay>
      </Container>

      <Container p="12px" wide>
        <SettingsHeading heading="Personal Information" />
        <SettingsItem title="Email Address" body={user.email} />
        <SettingsItem title="First Name" body={user.firstName} />
        <SettingsItem title="Last Name" body={user.lastName} />
        <SettingsItem
          title="Phone Number"
          body={formatPhoneNumber(user.profile?.phone)}
        />
        <SettingsItem title="Country" body={user.profile?.country} />
        <SettingsItem title="City" body={user.profile?.city} />
        {user.profile.country === "United States" && (
        <SettingsItem 
          title="Social Security Number"
          body={user.profile?.ssn} />
        )}
        <SettingsItem
          title="Date of Birth"
          body={convertDate(user.profile?.dob)}
        />
        <SettingsItem title="Gender" body={capitalise(user.profile?.gender)} />
        <SettingsItem
          title="Date Joined"
          body={new Date(user.createdAt).toDateString()}
        />
      </Container>

      <ConfirmationModal
        open={show}
        title={title}
        message={message}
        action={callback}
        dismiss={close}
      />
    </Container>
  );
};

export default Home;
