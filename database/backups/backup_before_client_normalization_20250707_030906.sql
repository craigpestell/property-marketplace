--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: create_user_notification(character varying, character varying, text, character varying, integer, character varying, character varying); Type: FUNCTION; Schema: public; Owner: craig
--

CREATE FUNCTION public.create_user_notification(p_user_email character varying, p_title character varying, p_message text, p_type character varying, p_related_offer_id integer DEFAULT NULL::integer, p_related_property_uid character varying DEFAULT NULL::character varying, p_priority character varying DEFAULT 'normal'::character varying) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    notification_id INTEGER;
BEGIN
    INSERT INTO user_notifications (
        user_email, title, message, type, related_offer_id, related_property_uid, priority
    ) VALUES (
        p_user_email, p_title, p_message, p_type, p_related_offer_id, p_related_property_uid, p_priority
    ) RETURNING user_notifications.notification_id INTO notification_id;
    
    RETURN notification_id;
END;
$$;


ALTER FUNCTION public.create_user_notification(p_user_email character varying, p_title character varying, p_message text, p_type character varying, p_related_offer_id integer, p_related_property_uid character varying, p_priority character varying) OWNER TO craig;

--
-- Name: update_offers_updated_at(); Type: FUNCTION; Schema: public; Owner: craig
--

CREATE FUNCTION public.update_offers_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_offers_updated_at() OWNER TO craig;

--
-- Name: update_showing_times_updated_at(); Type: FUNCTION; Schema: public; Owner: craig
--

CREATE FUNCTION public.update_showing_times_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_showing_times_updated_at() OWNER TO craig;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: craig
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO craig;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: app_config; Type: TABLE; Schema: public; Owner: craig
--

CREATE TABLE public.app_config (
    id integer NOT NULL,
    config_key character varying(255) NOT NULL,
    config_value text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.app_config OWNER TO craig;

--
-- Name: app_config_id_seq; Type: SEQUENCE; Schema: public; Owner: craig
--

CREATE SEQUENCE public.app_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.app_config_id_seq OWNER TO craig;

--
-- Name: app_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: craig
--

ALTER SEQUENCE public.app_config_id_seq OWNED BY public.app_config.id;


--
-- Name: clients; Type: TABLE; Schema: public; Owner: craig
--

CREATE TABLE public.clients (
    id integer NOT NULL,
    name character varying(100),
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    client_uid character varying(36) NOT NULL
);


ALTER TABLE public.clients OWNER TO craig;

--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: craig
--

CREATE SEQUENCE public.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.clients_id_seq OWNER TO craig;

--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: craig
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- Name: counter_offers; Type: TABLE; Schema: public; Owner: craig
--

CREATE TABLE public.counter_offers (
    counter_offer_id integer NOT NULL,
    original_offer_id integer NOT NULL,
    counter_amount numeric(12,2) NOT NULL,
    counter_terms text,
    closing_date date,
    created_by character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    original_offer_uid character varying(50)
);


ALTER TABLE public.counter_offers OWNER TO craig;

--
-- Name: counter_offers_counter_offer_id_seq; Type: SEQUENCE; Schema: public; Owner: craig
--

CREATE SEQUENCE public.counter_offers_counter_offer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.counter_offers_counter_offer_id_seq OWNER TO craig;

--
-- Name: counter_offers_counter_offer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: craig
--

ALTER SEQUENCE public.counter_offers_counter_offer_id_seq OWNED BY public.counter_offers.counter_offer_id;


--
-- Name: offer_notifications; Type: TABLE; Schema: public; Owner: craig
--

CREATE TABLE public.offer_notifications (
    notification_id integer NOT NULL,
    offer_id integer NOT NULL,
    recipient_email character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    message text NOT NULL,
    read_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT offer_notifications_type_check CHECK (((type)::text = ANY ((ARRAY['offer_received'::character varying, 'offer_accepted'::character varying, 'offer_rejected'::character varying, 'offer_countered'::character varying, 'offer_withdrawn'::character varying, 'offer_expired'::character varying])::text[])))
);


ALTER TABLE public.offer_notifications OWNER TO craig;

--
-- Name: offer_notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: craig
--

CREATE SEQUENCE public.offer_notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.offer_notifications_notification_id_seq OWNER TO craig;

--
-- Name: offer_notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: craig
--

ALTER SEQUENCE public.offer_notifications_notification_id_seq OWNED BY public.offer_notifications.notification_id;


--
-- Name: offers; Type: TABLE; Schema: public; Owner: craig
--

CREATE TABLE public.offers (
    offer_id integer NOT NULL,
    property_uid character varying(255) NOT NULL,
    buyer_email character varying(255) NOT NULL,
    seller_email character varying(255) NOT NULL,
    offer_amount numeric(12,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    message text,
    financing_type character varying(50) DEFAULT 'conventional'::character varying,
    contingencies text[],
    closing_date date,
    earnest_money numeric(12,2),
    inspection_period_days integer DEFAULT 10,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    expires_at timestamp without time zone DEFAULT (CURRENT_TIMESTAMP + '72:00:00'::interval),
    offer_uid character varying(50) NOT NULL,
    CONSTRAINT offers_financing_type_check CHECK (((financing_type)::text = ANY ((ARRAY['cash'::character varying, 'conventional'::character varying, 'fha'::character varying, 'va'::character varying, 'other'::character varying])::text[]))),
    CONSTRAINT offers_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'rejected'::character varying, 'countered'::character varying, 'withdrawn'::character varying, 'expired'::character varying])::text[])))
);


ALTER TABLE public.offers OWNER TO craig;

--
-- Name: offers_offer_id_seq; Type: SEQUENCE; Schema: public; Owner: craig
--

CREATE SEQUENCE public.offers_offer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.offers_offer_id_seq OWNER TO craig;

--
-- Name: offers_offer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: craig
--

ALTER SEQUENCE public.offers_offer_id_seq OWNED BY public.offers.offer_id;


--
-- Name: properties; Type: TABLE; Schema: public; Owner: craig
--

CREATE TABLE public.properties (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    price integer NOT NULL,
    image_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    client_id integer,
    deleted boolean DEFAULT false,
    uuid uuid DEFAULT public.uuid_generate_v4(),
    property_uid character varying(50),
    details text,
    user_email character varying(255),
    available_showing_times jsonb,
    property_color character varying(7) DEFAULT NULL::character varying,
    street_number character varying(20),
    street_name character varying(255),
    unit character varying(50),
    city character varying(100) DEFAULT 'Vancouver'::character varying NOT NULL,
    province character varying(50) DEFAULT 'British Columbia'::character varying NOT NULL,
    postal_code character varying(10),
    country character varying(100) DEFAULT 'Canada'::character varying NOT NULL,
    latitude numeric(10,8),
    longitude numeric(11,8),
    formatted_address text,
    address_type character varying(20) DEFAULT 'residential'::character varying,
    client_uid character varying(36),
    search_vector tsvector,
    CONSTRAINT properties_address_type_check CHECK (((address_type)::text = ANY ((ARRAY['residential'::character varying, 'commercial'::character varying, 'mixed'::character varying])::text[])))
);


ALTER TABLE public.properties OWNER TO craig;

--
-- Name: COLUMN properties.details; Type: COMMENT; Schema: public; Owner: craig
--

COMMENT ON COLUMN public.properties.details IS 'Additional property details and features in JSON or text format';


--
-- Name: COLUMN properties.property_color; Type: COMMENT; Schema: public; Owner: craig
--

COMMENT ON COLUMN public.properties.property_color IS 'Hex color code for calendar display (e.g., #3B82F6)';


--
-- Name: properties_id_seq; Type: SEQUENCE; Schema: public; Owner: craig
--

CREATE SEQUENCE public.properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.properties_id_seq OWNER TO craig;

--
-- Name: properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: craig
--

ALTER SEQUENCE public.properties_id_seq OWNED BY public.properties.id;


--
-- Name: saved_properties; Type: TABLE; Schema: public; Owner: craig
--

CREATE TABLE public.saved_properties (
    id integer NOT NULL,
    user_email character varying(255) NOT NULL,
    property_uid character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.saved_properties OWNER TO craig;

--
-- Name: TABLE saved_properties; Type: COMMENT; Schema: public; Owner: craig
--

COMMENT ON TABLE public.saved_properties IS 'Stores user saved/favorite properties';


--
-- Name: COLUMN saved_properties.user_email; Type: COMMENT; Schema: public; Owner: craig
--

COMMENT ON COLUMN public.saved_properties.user_email IS 'Email of the user who saved the property';


--
-- Name: COLUMN saved_properties.property_uid; Type: COMMENT; Schema: public; Owner: craig
--

COMMENT ON COLUMN public.saved_properties.property_uid IS 'UID of the saved property';


--
-- Name: COLUMN saved_properties.created_at; Type: COMMENT; Schema: public; Owner: craig
--

COMMENT ON COLUMN public.saved_properties.created_at IS 'When the property was saved';


--
-- Name: saved_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: craig
--

CREATE SEQUENCE public.saved_properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.saved_properties_id_seq OWNER TO craig;

--
-- Name: saved_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: craig
--

ALTER SEQUENCE public.saved_properties_id_seq OWNED BY public.saved_properties.id;


--
-- Name: showing_times; Type: TABLE; Schema: public; Owner: craig
--

CREATE TABLE public.showing_times (
    id integer NOT NULL,
    property_uid character varying(50) NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.showing_times OWNER TO craig;

--
-- Name: showing_times_id_seq; Type: SEQUENCE; Schema: public; Owner: craig
--

CREATE SEQUENCE public.showing_times_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.showing_times_id_seq OWNER TO craig;

--
-- Name: showing_times_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: craig
--

ALTER SEQUENCE public.showing_times_id_seq OWNED BY public.showing_times.id;


--
-- Name: showings; Type: TABLE; Schema: public; Owner: craig
--

CREATE TABLE public.showings (
    id integer NOT NULL,
    property_uid character varying(64) NOT NULL,
    date date NOT NULL,
    "time" time without time zone NOT NULL,
    user_name character varying(128),
    user_email character varying(256),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.showings OWNER TO craig;

--
-- Name: showings_id_seq; Type: SEQUENCE; Schema: public; Owner: craig
--

CREATE SEQUENCE public.showings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.showings_id_seq OWNER TO craig;

--
-- Name: showings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: craig
--

ALTER SEQUENCE public.showings_id_seq OWNED BY public.showings.id;


--
-- Name: user_notifications; Type: TABLE; Schema: public; Owner: craig
--

CREATE TABLE public.user_notifications (
    notification_id integer NOT NULL,
    user_email character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    type character varying(50) NOT NULL,
    related_offer_id integer,
    related_property_uid character varying(255),
    read_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    priority character varying(20) DEFAULT 'normal'::character varying,
    related_offer_uid character varying(50),
    CONSTRAINT user_notifications_priority_check CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'normal'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))),
    CONSTRAINT user_notifications_type_check CHECK (((type)::text = ANY ((ARRAY['offer_received'::character varying, 'offer_accepted'::character varying, 'offer_rejected'::character varying, 'offer_countered'::character varying, 'offer_withdrawn'::character varying, 'offer_expired'::character varying, 'system'::character varying, 'reminder'::character varying])::text[])))
);


ALTER TABLE public.user_notifications OWNER TO craig;

--
-- Name: user_notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: craig
--

CREATE SEQUENCE public.user_notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_notifications_notification_id_seq OWNER TO craig;

--
-- Name: user_notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: craig
--

ALTER SEQUENCE public.user_notifications_notification_id_seq OWNED BY public.user_notifications.notification_id;


--
-- Name: app_config id; Type: DEFAULT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.app_config ALTER COLUMN id SET DEFAULT nextval('public.app_config_id_seq'::regclass);


--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- Name: counter_offers counter_offer_id; Type: DEFAULT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.counter_offers ALTER COLUMN counter_offer_id SET DEFAULT nextval('public.counter_offers_counter_offer_id_seq'::regclass);


--
-- Name: offer_notifications notification_id; Type: DEFAULT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.offer_notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.offer_notifications_notification_id_seq'::regclass);


--
-- Name: offers offer_id; Type: DEFAULT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.offers ALTER COLUMN offer_id SET DEFAULT nextval('public.offers_offer_id_seq'::regclass);


--
-- Name: properties id; Type: DEFAULT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.properties ALTER COLUMN id SET DEFAULT nextval('public.properties_id_seq'::regclass);


--
-- Name: saved_properties id; Type: DEFAULT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.saved_properties ALTER COLUMN id SET DEFAULT nextval('public.saved_properties_id_seq'::regclass);


--
-- Name: showing_times id; Type: DEFAULT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.showing_times ALTER COLUMN id SET DEFAULT nextval('public.showing_times_id_seq'::regclass);


--
-- Name: showings id; Type: DEFAULT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.showings ALTER COLUMN id SET DEFAULT nextval('public.showings_id_seq'::regclass);


--
-- Name: user_notifications notification_id; Type: DEFAULT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.user_notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.user_notifications_notification_id_seq'::regclass);


--
-- Data for Name: app_config; Type: TABLE DATA; Schema: public; Owner: craig
--

COPY public.app_config (id, config_key, config_value, description, created_at, updated_at) FROM stdin;
1	featured_properties_limit	6	Number of properties to show in the Most Loved Properties section	2025-07-06 10:16:17.221557-07	2025-07-06 10:16:17.221557-07
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: craig
--

COPY public.clients (id, name, email, password_hash, created_at, client_uid) FROM stdin;
1	Test User	testuser@example.com	$2b$10$g7NaXMKmnfvM2XgvQVcYkOsnx.hBaP6Jwxirwnou37ZcIhNyRCBHS	2025-06-29 01:18:25.226784	9fae85d0-eedd-4c96-90d7-0af942d565d7
2	Craig Pestell	craigpestell@gmail.com	$2b$12$F..BDBU4tVsYISReXEHzYO7hcAjnC/ySlwwXu0jjZPuWcFgV9.47e	2025-07-05 13:14:11.344799	4b1c8110-eeb6-45c7-bbed-667fd438a70b
4	Michael Chen	buyer2@example.com	$2b$12$TXN.Uqh/x9idJNbdZMpwq.ZV0Gf.tQRemgwyoS597j4byEohPrnMK	2025-07-05 16:13:32.858592	93dcfdb3-981c-4d0b-9370-89e8b9a2eb90
5	Sarah Thompson	seller1@example.com	$2b$12$TXN.Uqh/x9idJNbdZMpwq.ZV0Gf.tQRemgwyoS597j4byEohPrnMK	2025-07-05 16:13:32.858592	06cbc493-8742-4a5f-9f74-df17dea9065b
6	David Williams	seller2@example.com	$2b$12$TXN.Uqh/x9idJNbdZMpwq.ZV0Gf.tQRemgwyoS597j4byEohPrnMK	2025-07-05 16:13:32.858592	79f5925d-dbf2-4754-95e3-8da4a18e522d
7	Lisa Martinez	agent1@example.com	$2b$12$TXN.Uqh/x9idJNbdZMpwq.ZV0Gf.tQRemgwyoS597j4byEohPrnMK	2025-07-05 16:13:32.858592	a00dec9d-1c2c-4423-a1df-372ecc2f5a2d
3	Emily Rodriguez	buyer1@example.com	$2b$12$TXN.Uqh/x9idJNbdZMpwq.ZV0Gf.tQRemgwyoS597j4byEohPrnMK	2025-07-05 16:13:32.858592	c4f4078a-3f38-4087-99ec-8c4c6902854b
\.


--
-- Data for Name: counter_offers; Type: TABLE DATA; Schema: public; Owner: craig
--

COPY public.counter_offers (counter_offer_id, original_offer_id, counter_amount, counter_terms, closing_date, created_by, created_at, original_offer_uid) FROM stdin;
2	3	242500.00	We appreciate your offer but would like to counter at this price. We can be flexible on the closing date.	\N	craigpestell@gmail.com	2025-07-05 16:01:12.142226	OFFER-ECCBC87E-3
3	9	198000.00	We appreciate your interest! We can accept $198,000 with a slightly later closing date to accommodate our moving timeline.	2025-09-15	seller1@example.com	2025-07-05 16:13:32.874043	OFFER-45C48CCE-9
4	13	475000.00		\N	seller1@example.com	2025-07-05 16:26:35.108037	OFFER-C51CE410-13
\.


--
-- Data for Name: offer_notifications; Type: TABLE DATA; Schema: public; Owner: craig
--

COPY public.offer_notifications (notification_id, offer_id, recipient_email, type, message, read_at, created_at) FROM stdin;
2	1	craigpestell@gmail.com	offer_received	New offer of $427,500 received for "Modern Family Home"	\N	2025-07-05 16:01:12.145067
3	6	craigpestell@gmail.com	offer_received	New offer of $445,000 received for "Modern Family Home"	\N	2025-07-05 16:01:12.145067
4	2	buyer2@example.com	offer_accepted	Congratulations! Your offer of $320,000 for "Downtown Apartment" has been accepted!	\N	2025-07-05 16:01:12.145067
5	3	buyer3@example.com	offer_countered	Your offer for "Cozy Cottage" has been countered at $242,500. Please review the new terms.	\N	2025-07-05 16:01:12.145067
6	4	buyer4@example.com	offer_rejected	Unfortunately, your offer of $960,000 for "Luxury Villa" was not accepted at this time.	\N	2025-07-05 16:01:12.145067
7	5	craigpestell@gmail.com	offer_withdrawn	The buyer has withdrawn their offer of $372,400 for "Suburban House".	\N	2025-07-05 16:01:12.145067
8	7	seller1@example.com	offer_received	New offer received for Stunning Victorian Family Home at $465000.00	\N	2025-07-05 16:13:32.874955
9	8	seller2@example.com	offer_received	New offer received for Luxury Executive Estate at $825000.00	\N	2025-07-05 16:13:32.874955
10	10	buyer2@example.com	offer_accepted	Your offer for Modern Downtown Loft has been accepted!	\N	2025-07-05 16:13:32.874955
11	11	buyer1@example.com	offer_rejected	Your offer for Cozy Suburban Ranch has been declined.	\N	2025-07-05 16:13:32.874955
12	9	buyer1@example.com	offer_countered	The seller has made a counter offer for Charming Cottage Retreat	\N	2025-07-05 16:13:32.874955
13	13	seller1@example.com	offer_received	New offer of $465,000 received for "Stunning Victorian Family Home"	\N	2025-07-05 16:23:27.08845
14	13	buyer1@example.com	offer_countered	not enough!	\N	2025-07-05 16:26:35.112724
15	7	buyer1@example.com	offer_rejected	Your offer of $465000.00 for "Stunning Victorian Family Home" has been rejected.	\N	2025-07-05 16:27:27.067169
\.


--
-- Data for Name: offers; Type: TABLE DATA; Schema: public; Owner: craig
--

COPY public.offers (offer_id, property_uid, buyer_email, seller_email, offer_amount, status, message, financing_type, contingencies, closing_date, earnest_money, inspection_period_days, created_at, updated_at, expires_at, offer_uid) FROM stdin;
1	PROP-1751157039.932465-1	buyer1@example.com	craigpestell@gmail.com	427500.00	pending	We love this property and would like to make a competitive offer. We are pre-approved for financing and can close quickly.	conventional	{Inspection,Financing,Appraisal}	2025-08-19	5000.00	10	2025-07-05 16:01:12.137707	2025-07-05 18:16:11.379237	2025-07-08 16:01:12.137707	OFFER-C4CA4238-1
2	PROP-1751157039.932465-2	buyer2@example.com	craigpestell@gmail.com	320000.00	accepted	Full price offer! We are cash buyers and can close in 30 days with no contingencies.	cash	{"Final walk-through"}	2025-08-04	10000.00	7	2025-07-05 16:01:12.137707	2025-07-05 18:16:11.379237	2025-07-08 16:01:12.137707	OFFER-C81E728D-2
3	PROP-1751157039.932465-3	buyer3@example.com	craigpestell@gmail.com	225000.00	countered	We would like to submit this offer contingent on inspection and financing approval.	fha	{Inspection,Financing,Appraisal,"Sale of current home"}	2025-09-03	3000.00	14	2025-07-05 16:01:12.137707	2025-07-05 18:16:11.379237	2025-07-08 16:01:12.137707	OFFER-ECCBC87E-3
4	PROP-1751157039.932465-4	buyer4@example.com	craigpestell@gmail.com	960000.00	rejected	This is our best offer based on recent comparable sales in the area.	conventional	{Inspection,Financing,Appraisal}	2025-08-19	25000.00	10	2025-07-05 16:01:12.137707	2025-07-05 18:16:11.379237	2025-07-08 16:01:12.137707	OFFER-A87FF679-4
5	PROP-1751157039.932465-5	buyer5@example.com	craigpestell@gmail.com	372400.00	withdrawn	Competitive offer with quick closing timeline.	va	{Inspection,Financing}	2025-08-04	4000.00	7	2025-07-05 16:01:12.137707	2025-07-05 18:16:11.379237	2025-07-08 16:01:12.137707	OFFER-E4DA3B7F-5
6	PROP-1751157039.932465-1	buyer6@example.com	craigpestell@gmail.com	445000.00	pending	This is a beautiful home perfect for our growing family. We can be flexible on closing date.	conventional	{Inspection,Financing}	2025-08-09	7500.00	10	2025-07-05 16:01:12.137707	2025-07-05 18:16:11.379237	2025-07-08 16:01:12.137707	OFFER-1679091C-6
8	SEED-PROP-004	buyer2@example.com	seller2@example.com	825000.00	pending	This executive estate is exactly what we've been searching for. We can offer a quick closing and have excellent credit.	conventional	{inspection,appraisal}	2025-08-30	25000.00	10	2025-07-05 16:13:32.87274	2025-07-05 18:16:11.379237	2025-07-08 16:13:32.87274	OFFER-C9F0F895-8
9	SEED-PROP-003	buyer1@example.com	seller1@example.com	185000.00	countered	This cottage would be perfect for our first home. We're excited about the potential and the neighborhood.	fha	{inspection,financing,appraisal}	2025-09-01	3000.00	14	2025-07-05 16:13:32.87274	2025-07-05 18:16:11.379237	2025-07-08 16:13:32.87274	OFFER-45C48CCE-9
10	SEED-PROP-002	buyer2@example.com	seller1@example.com	270000.00	accepted	We love the downtown location and modern amenities. Looking forward to city living!	cash	{inspection}	2025-08-15	8000.00	7	2025-07-05 16:13:32.87274	2025-07-05 18:16:11.379237	2025-07-08 16:13:32.87274	OFFER-D3D94468-10
11	SEED-PROP-005	buyer1@example.com	seller2@example.com	295000.00	rejected	This ranch home fits our budget and family needs perfectly. Hope we can work something out.	conventional	{inspection,financing,appraisal}	2025-09-10	5000.00	14	2025-07-05 16:13:32.87274	2025-07-05 18:16:11.379237	2025-07-08 16:13:32.87274	OFFER-6512BD43-11
12	SEED-PROP-006	buyer2@example.com	seller2@example.com	380000.00	withdrawn	We found this townhouse very appealing, but circumstances have changed.	conventional	{inspection,financing}	2025-08-25	8000.00	10	2025-07-05 16:13:32.87274	2025-07-05 18:16:11.379237	2025-07-08 16:13:32.87274	OFFER-C20AD4D7-12
13	SEED-PROP-001	buyer1@example.com	seller1@example.com	465000.00	countered	good deal	conventional	{Inspection,Financing}	2025-07-19	10000.00	10	2025-07-05 16:23:27.086014	2025-07-05 18:16:11.379237	2025-07-08 16:23:27.086014	OFFER-C51CE410-13
7	SEED-PROP-001	buyer1@example.com	seller1@example.com	465000.00	rejected	We absolutely love this Victorian home! Our family has been looking for a house with this much character and charm. We're pre-approved and ready to close quickly.	conventional	{inspection,financing,appraisal}	2025-09-15	15000.00	14	2025-07-05 16:13:32.87274	2025-07-05 18:16:11.379237	2025-07-08 16:13:32.87274	OFFER-8F14E45F-7
18	sf_vic_001	investor.james@email.com	john.smith@email.com	1200000.00	pending	Very interested in this Victorian home. Can close quickly with cash.	conventional	\N	\N	\N	10	2025-07-03 23:12:33.812565	2025-07-03 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-001-sf-vic
19	sf_condo_002	buyer.susan@email.com	sarah.johnson@email.com	2050000.00	accepted	Love the SOMA location and city views. Ready to proceed.	conventional	\N	\N	\N	10	2025-06-30 23:12:33.812565	2025-07-04 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-002-sf-condo
20	sf_house_003	family.mike@email.com	mike.brown@email.com	1400000.00	rejected	Great neighborhood for families. Hope we can work something out.	conventional	\N	\N	\N	10	2025-06-28 23:12:33.812565	2025-07-02 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-003-sf-house
21	sf_loft_004	artist.emily@email.com	emily.davis@email.com	1750000.00	countered	Perfect space for my art studio. Industrial character is amazing.	conventional	\N	\N	\N	10	2025-06-25 23:12:33.812565	2025-06-27 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-004-sf-loft
22	sf_house_005	tech.exec@email.com	david.wilson@email.com	4200000.00	pending	Exceptional property with incredible views. Would love to schedule a second viewing.	conventional	\N	\N	\N	10	2025-06-23 23:12:33.812565	2025-06-23 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-005-sf-mansion
23	la_house_011	celebrity.agent@email.com	james.jackson@email.com	5200000.00	accepted	Client loves the Beverly Hills location and privacy. Ready to close immediately.	conventional	\N	\N	\N	10	2025-06-20 23:12:33.812565	2025-06-25 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-006-la-estate
24	la_condo_012	downtown.pro@email.com	nicole.white@email.com	820000.00	pending	Great location for work downtown. Love the urban lifestyle.	conventional	\N	\N	\N	10	2025-06-17 23:12:33.812565	2025-06-17 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-007-la-loft
25	la_house_013	beach.lover@email.com	kevin.harris@email.com	3100000.00	rejected	Dream home by the beach. Ocean views are spectacular.	conventional	\N	\N	\N	10	2025-06-15 23:12:33.812565	2025-06-20 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-008-la-beach
26	la_house_014	hills.buyer@email.com	michelle.martin@email.com	2350000.00	countered	Love the modern design and Hollywood Hills location.	conventional	\N	\N	\N	10	2025-06-13 23:12:33.812565	2025-06-15 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-009-la-modern
27	la_condo_015	westwood.family@email.com	brandon.garcia@email.com	1050000.00	accepted	Perfect for our family near UCLA. Great building amenities.	conventional	\N	\N	\N	10	2025-06-10 23:12:33.812565	2025-06-13 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-010-la-westwood
28	ny_apt_161	wall.street@email.com	alexandra.chen@email.com	4000000.00	pending	Stunning penthouse with Central Park views. Perfect for entertaining clients.	conventional	\N	\N	\N	10	2025-06-07 23:12:33.812565	2025-06-07 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-011-ny-penthouse
29	ny_loft_162	soho.gallery@email.com	marcus.wright@email.com	2700000.00	accepted	Incredible space for my gallery. The cast-iron architecture is perfect.	conventional	\N	\N	\N	10	2025-06-05 23:12:33.812565	2025-06-10 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-012-ny-soho
30	ny_condo_163	brooklyn.young@email.com	sofia.rivera@email.com	1800000.00	rejected	Love Brooklyn Heights and the Manhattan views. Hope to find something similar.	conventional	\N	\N	\N	10	2025-06-03 23:12:33.812565	2025-06-05 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-013-ny-brooklyn
31	ny_apt_164	village.resident@email.com	jonathan.kim@email.com	3400000.00	countered	Greenwich Village is my dream neighborhood. Historic charm is unmatched.	conventional	\N	\N	\N	10	2025-05-31 23:12:33.812565	2025-06-02 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-014-ny-village
32	ny_apt_165	finance.exec@email.com	natasha.petrov@email.com	5000000.00	pending	Premium Tribeca location with world-class amenities. Ready to move quickly.	conventional	\N	\N	\N	10	2025-05-29 23:12:33.812565	2025-05-29 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-015-ny-tribeca
33	mia_apt_201	beach.investor@email.com	carlos.santos@email.com	3100000.00	accepted	Art Deco penthouse on Ocean Drive is a dream investment. Beach lifestyle at its finest.	conventional	\N	\N	\N	10	2025-05-26 23:12:33.812565	2025-05-31 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-016-mia-beach
34	mia_condo_202	brickell.buyer@email.com	maria.rodriguez@email.com	820000.00	pending	Love the Brickell location and modern amenities. Great for city living.	conventional	\N	\N	\N	10	2025-05-24 23:12:33.812565	2025-05-24 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-017-mia-brickell
35	mia_house_203	gables.family@email.com	jose.fernandez@email.com	2300000.00	rejected	Beautiful Mediterranean style in prestigious Coral Gables. Perfect for our family.	conventional	\N	\N	\N	10	2025-05-21 23:12:33.812565	2025-05-26 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-018-mia-gables
36	mia_condo_204	key.resident@email.com	ana.lopez@email.com	1900000.00	countered	Key Biscayne oceanfront living is exactly what we are looking for.	conventional	\N	\N	\N	10	2025-05-19 23:12:33.812565	2025-05-21 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-019-mia-key
37	mia_house_205	grove.buyer@email.com	ricardo.morales@email.com	4300000.00	accepted	Magnificent bayfront estate in Coconut Grove. The dock access is perfect for our yacht.	conventional	\N	\N	\N	10	2025-05-16 23:12:33.812565	2025-05-19 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-020-mia-grove
38	chi_apt_241	lincoln.family@email.com	thomas.kowalski@email.com	1400000.00	pending	Victorian conversion in Lincoln Park is exactly what we have been searching for.	conventional	\N	\N	\N	10	2025-05-14 23:12:33.812565	2025-05-14 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-021-chi-lincoln
39	chi_loft_242	river.artist@email.com	anna.novak@email.com	920000.00	accepted	River North loft perfect for my studio and gallery space. Industrial character is amazing.	conventional	\N	\N	\N	10	2025-05-11 23:12:33.812565	2025-05-16 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-022-chi-river
40	chi_house_243	wicker.creative@email.com	peter.jankowski@email.com	730000.00	rejected	Love the artistic community in Wicker Park. This house has great creative potential.	conventional	\N	\N	\N	10	2025-05-09 23:12:33.812565	2025-05-11 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-023-chi-wicker
41	chi_condo_244	gold.exec@email.com	maria.kowalczyk@email.com	2100000.00	countered	Gold Coast luxury with Lake Michigan views. Perfect for entertaining.	conventional	\N	\N	\N	10	2025-05-06 23:12:33.812565	2025-05-09 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-024-chi-gold
42	chi_house_245	logan.buyer@email.com	jan.wisniewski@email.com	630000.00	pending	Classic Chicago bungalow in trendy Logan Square. Love the neighborhood character.	conventional	\N	\N	\N	10	2025-05-04 23:12:33.812565	2025-05-04 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-025-chi-logan
43	bos_apt_281	back.bay@email.com	patrick.sullivan@email.com	2750000.00	accepted	Victorian brownstone in Back Bay is the epitome of Boston elegance. Historic charm unmatched.	conventional	\N	\N	\N	10	2025-05-01 23:12:33.812565	2025-05-06 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-026-bos-back
44	bos_condo_282	north.end@email.com	mary.obrien@email.com	1400000.00	pending	North End historic condo with Italian heritage. Love the Freedom Trail location.	conventional	\N	\N	\N	10	2025-04-29 23:12:33.812565	2025-04-29 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-027-bos-north
45	bos_house_283	harvard.prof@email.com	james.fitzgerald@email.com	3100000.00	rejected	Harvard Square location perfect for academic lifestyle. Historic home with character.	conventional	\N	\N	\N	10	2025-04-26 23:12:33.812565	2025-05-01 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-028-bos-cambridge
46	bos_loft_284	south.end@email.com	sarah.murphy@email.com	1800000.00	countered	South End warehouse conversion is exactly the modern space we need.	conventional	\N	\N	\N	10	2025-04-24 23:12:33.812565	2025-04-26 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-029-bos-south
47	bos_condo_285	beacon.resident@email.com	michael.kelly@email.com	2150000.00	accepted	Beacon Hill historic district with cobblestone charm. Dream Boston location.	conventional	\N	\N	\N	10	2025-04-21 23:12:33.812565	2025-04-24 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-030-bos-beacon
48	sf_condo_006	marina.sailor@email.com	jessica.miller@email.com	1600000.00	accepted	Marina District condo with bay views perfect for sailing lifestyle.	conventional	\N	\N	\N	10	2025-04-16 23:12:33.812565	2025-04-21 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-031-sf-marina
49	sf_house_007	castro.couple@email.com	chris.moore@email.com	1320000.00	rejected	Love the Castro District community and this charming cottage.	conventional	\N	\N	\N	10	2025-04-11 23:12:33.812565	2025-04-16 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-032-sf-castro
50	sf_penthouse_008	nob.hill@email.com	amanda.taylor@email.com	3100000.00	accepted	Nob Hill penthouse with 360-degree views is a once-in-a-lifetime opportunity.	conventional	\N	\N	\N	10	2025-04-06 23:12:33.812565	2025-04-11 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-033-sf-nob
51	la_house_016	venice.artist@email.com	stephanie.rodriguez@email.com	1600000.00	pending	Venice Beach bungalow on Abbot Kinney is perfect for my artistic lifestyle.	conventional	\N	\N	\N	10	2025-04-01 23:12:33.812565	2025-04-01 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-034-la-venice
52	la_house_017	malibu.family@email.com	tyler.lee@email.com	7500000.00	accepted	Malibu oceanfront estate with private beach is our dream home. Ready to close immediately.	conventional	\N	\N	\N	10	2025-03-27 23:12:33.812565	2025-04-01 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-035-la-malibu
53	ny_apt_166	les.hipster@email.com	carlos.mendez@email.com	1220000.00	rejected	Lower East Side modern condo in vibrant neighborhood. Love the energy here.	conventional	\N	\N	\N	10	2025-03-22 23:12:33.812565	2025-03-27 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-036-ny-lower
54	ny_apt_167	wburg.creative@email.com	elena.vasquez@email.com	1620000.00	accepted	Williamsburg warehouse conversion with Manhattan views. Perfect for creative work.	conventional	\N	\N	\N	10	2025-03-17 23:12:33.812565	2025-03-22 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-037-ny-williamsburg
55	ny_apt_168	uws.family@email.com	dmitri.volkov@email.com	2850000.00	countered	Upper West Side classic six near Central Park. Perfect for raising children.	conventional	\N	\N	\N	10	2025-03-12 23:12:33.812565	2025-03-17 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-038-ny-uws
56	mia_condo_206	wynwood.collector@email.com	diego.herrera@email.com	630000.00	accepted	Wynwood Arts District loft surrounded by incredible street art and galleries.	conventional	\N	\N	\N	10	2025-03-07 23:12:33.812565	2025-03-12 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-039-mia-wynwood
57	mia_condo_207	aventura.shopper@email.com	fernanda.silva@email.com	1320000.00	pending	Aventura luxury tower near world-class shopping. Perfect location for our lifestyle.	conventional	\N	\N	\N	10	2025-03-02 23:12:33.812565	2025-03-02 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-040-mia-aventura
58	chi_apt_246	bucktown.young@email.com	katarzyna.zielinska@email.com	830000.00	rejected	Bucktown modern townhouse in trendy neighborhood. Love the rooftop deck.	conventional	\N	\N	\N	10	2025-02-25 23:12:33.812565	2025-03-02 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-041-chi-bucktown
59	chi_condo_247	south.loop@email.com	andrzej.kowalski@email.com	530000.00	accepted	South Loop high-rise with skyline views. Perfect downtown living.	conventional	\N	\N	\N	10	2025-02-20 23:12:33.812565	2025-02-25 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-042-chi-south
60	chi_house_248	hyde.professor@email.com	magdalena.nowak@email.com	1600000.00	countered	Hyde Park historic mansion near University of Chicago. Academic dream home.	conventional	\N	\N	\N	10	2025-02-15 23:12:33.812565	2025-02-20 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-043-chi-hyde
61	bos_apt_286	porter.commuter@email.com	jennifer.ryan@email.com	730000.00	accepted	Somerville Porter Square location perfect for T commute. Diverse neighborhood.	conventional	\N	\N	\N	10	2025-02-10 23:12:33.812565	2025-02-15 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-044-bos-somerville
62	bos_house_287	jp.artist@email.com	david.mccarthy@email.com	920000.00	pending	Jamaica Plain Victorian in eclectic artist community. Love the local culture.	conventional	\N	\N	\N	10	2025-02-05 23:12:33.812565	2025-02-05 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-045-bos-jamaica
63	sf_vic_001	competitive.buyer1@email.com	john.smith@email.com	1280000.00	rejected	Willing to go above asking for this beautiful Victorian. No contingencies.	conventional	\N	\N	\N	10	2025-01-31 23:12:33.812565	2025-02-05 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-046-sf-vic-alt
64	sf_vic_001	competitive.buyer2@email.com	john.smith@email.com	1300000.00	rejected	Dream home in Mission District. Can close in 15 days cash.	conventional	\N	\N	\N	10	2025-01-31 23:12:33.812565	2025-02-03 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-047-sf-vic-alt2
65	la_house_011	beverly.buyer2@email.com	james.jackson@email.com	5300000.00	rejected	Beverly Hills estate perfect for entertaining. Ready to exceed asking price.	conventional	\N	\N	\N	10	2025-01-26 23:12:33.812565	2025-01-31 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-048-la-estate-alt
66	ny_apt_165	tribeca.buyer2@email.com	natasha.petrov@email.com	5100000.00	rejected	Luxury Tribeca condo with world-class amenities. All cash offer.	conventional	\N	\N	\N	10	2025-01-21 23:12:33.812565	2025-01-26 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-049-ny-tribeca-alt
67	mia_apt_201	ocean.buyer2@email.com	carlos.santos@email.com	3150000.00	rejected	Art Deco penthouse on Ocean Drive. Investment opportunity of a lifetime.	conventional	\N	\N	\N	10	2025-01-16 23:12:33.812565	2025-01-21 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-050-mia-beach-alt
68	sf_house_009	hayes.buyer@email.com	ryan.anderson@email.com	1520000.00	accepted	Hayes Valley modern home with smart features. Perfect for tech lifestyle.	conventional	\N	\N	\N	10	2024-12-17 23:12:33.812565	2025-01-06 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-051-closed1
69	la_condo_018	century.exec@email.com	rachel.gonzalez@email.com	1330000.00	accepted	Century City tower with city views. Convenient for business meetings.	conventional	\N	\N	\N	10	2024-12-07 23:12:33.812565	2024-12-27 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-052-closed2
70	ny_apt_169	chelsea.young@email.com	isabelle.laurent@email.com	920000.00	accepted	Chelsea modern studio perfect for young professional. Great building amenities.	conventional	\N	\N	\N	10	2024-11-27 23:12:33.812565	2024-12-17 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-053-closed3
71	mia_house_208	beach.family@email.com	pablo.gutierrez@email.com	2150000.00	accepted	Miami Beach historic home with modern updates. Perfect family location.	conventional	\N	\N	\N	10	2024-11-17 23:12:33.812565	2024-12-07 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-054-closed4
72	chi_loft_249	west.loop@email.com	pawel.krawczyk@email.com	1220000.00	accepted	West Loop warehouse conversion with high ceilings. Industrial character perfect.	conventional	\N	\N	\N	10	2024-11-07 23:12:33.812565	2024-11-27 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-055-closed5
73	bos_condo_288	seaport.lowball@email.com	lisa.connor@email.com	1400000.00	rejected	Seaport District modern condo. Hope we can negotiate on price.	conventional	\N	\N	\N	10	2024-10-28 23:12:33.812565	2024-11-07 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-056-old-reject1
74	sf_condo_010	russian.hill@email.com	lisa.thomas@email.com	1650000.00	rejected	Russian Hill views are spectacular. Would love to find middle ground on price.	conventional	\N	\N	\N	10	2024-10-18 23:12:33.812565	2024-10-28 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-057-old-reject2
75	la_house_019	silver.lake@email.com	daniel.lopez@email.com	1180000.00	rejected	Silver Lake Craftsman with original details. Perfect for our restoration project.	conventional	\N	\N	\N	10	2024-10-08 23:12:33.812565	2024-10-18 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-058-old-reject3
76	ny_apt_170	east.village@email.com	pierre.dubois@email.com	850000.00	rejected	East Village walkup charm in vibrant neighborhood. Love the exposed brick.	conventional	\N	\N	\N	10	2024-09-28 23:12:33.812565	2024-10-08 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-059-old-reject4
77	mia_condo_209	downtown.mia@email.com	valentina.castro@email.com	720000.00	rejected	Downtown Miami skyline views perfect for young professional lifestyle.	conventional	\N	\N	\N	10	2024-09-18 23:12:33.812565	2024-09-28 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-060-old-reject5
78	chi_house_260	bridgeport.worker@email.com	ryszard.nowicki@email.com	310000.00	accepted	Working-class home in historic Bridgeport. Perfect starter home for our family.	conventional	\N	\N	\N	10	2024-09-08 23:12:33.812565	2024-09-18 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-061-affordable1
79	bos_apt_294	allston.student@email.com	stephanie.mcgrath@email.com	400000.00	pending	Student-friendly apartment near BU. Great investment for college rental.	conventional	\N	\N	\N	10	2024-08-29 23:12:33.812565	2024-08-29 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-062-affordable2
80	ny_apt_176	meatpacking.luxury@email.com	alessandro.conti@email.com	6500000.00	countered	Ultra-luxury penthouse in Meatpacking District. Ready for immediate occupancy.	conventional	\N	\N	\N	10	2024-08-19 23:12:33.812565	2024-08-24 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-063-luxury1
81	mia_condo_211	bal.harbour@email.com	isabella.vargas@email.com	5300000.00	accepted	Bal Harbour oceanfront luxury beyond compare. Private beach access is perfect.	conventional	\N	\N	\N	10	2024-08-09 23:12:33.812565	2024-08-19 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-064-luxury2
82	bos_house_289	coolidge.family@email.com	kevin.donovan@email.com	1320000.00	rejected	Brookline Coolidge Corner perfect for families. Great schools nearby.	conventional	\N	\N	\N	10	2024-07-30 23:12:33.812565	2024-08-09 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-065-family1
83	chi_condo_250	streeterville.prof@email.com	agnieszka.lewandowska@email.com	1820000.00	pending	Streeterville marina views for lake lifestyle. Perfect for sailing enthusiast.	conventional	\N	\N	\N	10	2025-07-02 23:12:33.812565	2025-07-02 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-066-recent1
84	bos_loft_284	south.end.couple@email.com	sarah.murphy@email.com	1820000.00	countered	South End warehouse conversion perfect for our modern lifestyle.	conventional	\N	\N	\N	10	2025-07-01 23:12:33.812565	2025-07-03 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-067-recent2
85	mia_house_210	pinecrest.schools@email.com	gabriel.mendoza@email.com	1620000.00	accepted	Pinecrest family estate with top schools. Perfect for our growing family.	conventional	\N	\N	\N	10	2025-06-29 23:12:33.812565	2025-07-01 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-068-recent3
86	ny_apt_171	flatiron.startup@email.com	anastasia.petrov@email.com	2150000.00	pending	Flatiron District loft perfect for startup headquarters. Historic tin ceilings amazing.	conventional	\N	\N	\N	10	2025-06-27 23:12:33.812565	2025-06-27 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-069-recent4
87	sf_house_009	hayes.tech@email.com	ryan.anderson@email.com	1520000.00	rejected	Hayes Valley modern with smart features perfect for tech professional.	conventional	\N	\N	\N	10	2025-06-26 23:12:33.812565	2025-06-29 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-070-recent5
88	ny_apt_161	london.investor@email.com	alexandra.chen@email.com	4100000.00	pending	Manhattan penthouse for London client. Central Park views essential for investment.	conventional	\N	\N	\N	10	2025-06-24 23:12:33.812565	2025-06-24 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-071-intl1
89	mia_apt_201	brazil.buyer@email.com	carlos.santos@email.com	3050000.00	countered	South Beach Art Deco for Brazilian family. Ocean Drive location perfect.	conventional	\N	\N	\N	10	2025-06-22 23:12:33.812565	2025-06-25 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-072-intl2
90	la_house_017	tokyo.exec@email.com	tyler.lee@email.com	7600000.00	accepted	Malibu oceanfront for Tokyo executive. Private beach access essential.	conventional	\N	\N	\N	10	2025-06-19 23:12:33.812565	2025-06-22 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-073-intl3
91	sf_penthouse_008	singapore.fund@email.com	amanda.taylor@email.com	3150000.00	rejected	Nob Hill penthouse for Singapore investment fund. 360-degree views appealing.	conventional	\N	\N	\N	10	2025-06-16 23:12:33.812565	2025-06-19 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-074-intl4
92	bos_apt_281	paris.collector@email.com	patrick.sullivan@email.com	2800000.00	pending	Back Bay brownstone for Parisian art collector. Victorian charm irresistible.	conventional	\N	\N	\N	10	2025-06-14 23:12:33.812565	2025-06-14 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-075-intl5
93	chi_loft_261	chicago.reit@email.com	halina.zyskowska@email.com	520000.00	accepted	Noble Square artist loft for REIT portfolio. Strong rental potential.	conventional	\N	\N	\N	10	2025-06-12 23:12:33.812565	2025-06-17 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-076-invest1
94	bos_condo_295	boston.fund@email.com	christopher.oneill@email.com	530000.00	pending	Dorchester triple-decker for investment fund. Multi-unit income potential.	conventional	\N	\N	\N	10	2025-06-09 23:12:33.812565	2025-06-09 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-077-invest2
95	mia_condo_217	miami.investor@email.com	sofia.delgado@email.com	630000.00	rejected	Midtown Miami loft for rental investment. Design District proximity valuable.	conventional	\N	\N	\N	10	2025-06-06 23:12:33.812565	2025-06-11 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-078-invest3
96	ny_apt_180	lic.developer@email.com	olaf.peterson@email.com	1220000.00	countered	LIC waterfront for development company. Manhattan skyline views marketable.	conventional	\N	\N	\N	10	2025-06-04 23:12:33.812565	2025-06-07 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-079-invest4
97	la_condo_015	westwood.reit@email.com	brandon.garcia@email.com	1080000.00	accepted	Westwood high-rise for REIT expansion. UCLA proximity ensures rental demand.	conventional	\N	\N	\N	10	2025-06-01 23:12:33.812565	2025-06-04 23:12:33.812565	2025-07-08 23:12:33.812565	OFFER-080-invest5
98	SEED-PROP-001	buyer1@example.com	seller1@example.com	45000.00	pending		conventional	{Inspection,Financing}	2025-07-17	10000.00	10	2025-07-06 10:30:25.168863	2025-07-06 10:30:25.168863	2025-07-09 10:30:25.168863	OFFER-MCRY7574-FHTIM0
\.


--
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: craig
--

COPY public.properties (id, title, price, image_url, created_at, client_id, deleted, uuid, property_uid, details, user_email, available_showing_times, property_color, street_number, street_name, unit, city, province, postal_code, country, latitude, longitude, formatted_address, address_type, client_uid, search_vector) FROM stdin;
10	Cool loft	180000		2025-07-05 15:07:28.423886	2	t	1e5c787c-2a92-4ac7-849f-ef80ab310d62	PROP-MCQSNL3U-UUD8PF	{"propertyType":"","description":""}	craigpestell@gmail.com	\N	\N	4829	Willow Way	\N	New Westminster	British Columbia	V6E8 4E8	Canada	49.20995920	-122.90442764	4829 Willow Way, New Westminster, British Columbia, V6E8 4E8, Canada	residential	4b1c8110-eeb6-45c7-bbed-667fd438a70b	'4829':1 '4e8':9 'british':6 'columbia':7 'new':4 'v6e8':8 'way':3 'westminst':5 'willow':2
5	Suburban House	380000	https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd	2025-06-29 00:30:39.932465	\N	f	d3c03201-4609-4c11-9b01-0437fa8524d0	PROP-1751157039.932465-5	\N	craigpestell@gmail.com	\N	\N	568	Main Street	Apt 13	New Westminster	British Columbia	V5G3 3R8	Canada	49.19913306	-122.90064323	568 Main Street, Apt 13, New Westminster, British Columbia, V5G3 3R8, Canada	residential	4b1c8110-eeb6-45c7-bbed-667fd438a70b	'13':5 '3r8':11 '568':1 'apt':4 'british':8 'columbia':9 'main':2 'new':6 'street':3 'v5g3':10 'westminst':7
6	Sunny Suburban Home blah	350000	https://images.unsplash.com/photo-1506744038136-46273834b3fb	2025-06-29 02:02:02.632568	1	f	ba9519fa-2ecf-42ed-be11-51d3920af515	PROP-1751162522.632568-6	\N	craigpestell@gmail.com	\N	\N	4807	Willow Way	\N	Surrey	British Columbia	V6V0 2K4	Canada	49.17666355	-122.83726598	4807 Willow Way, Surrey, British Columbia, V6V0 2K4, Canada	residential	4b1c8110-eeb6-45c7-bbed-667fd438a70b	'2k4':8 '4807':1 'british':5 'columbia':6 'surrey':4 'v6v0':7 'way':3 'willow':2
4	Luxury Villa	1200000	https://images.unsplash.com/photo-1507089947368-19c1da9775ae	2025-06-29 00:30:39.932465	\N	f	8253e74a-5f27-4288-a4b5-b575a6b2871e	PROP-1751157039.932465-4	\N	craigpestell@gmail.com	\N	#F59E42	5557	Denman Street	\N	Vancouver	British Columbia	V3T3 5H7	Canada	49.32226176	-123.14891102	5557 Denman Street, Vancouver, British Columbia, V3T3 5H7, Canada	residential	4b1c8110-eeb6-45c7-bbed-667fd438a70b	'5557':1 '5h7':8 'british':5 'columbia':6 'denman':2 'street':3 'v3t3':7 'vancouv':4
2	Downtown Apartment	320000	https://images.unsplash.com/photo-1460518451285-97b6aa326961	2025-06-29 00:30:39.932465	\N	f	ab80da03-7df0-4afa-9396-81bd2ccc9fd7	PROP-1751157039.932465-2	\N	craigpestell@gmail.com	\N	\N	8748	Spruce Road	\N	Surrey	British Columbia	V4R3 1X6	Canada	49.17683655	-122.85388814	8748 Spruce Road, Surrey, British Columbia, V4R3 1X6, Canada	residential	4b1c8110-eeb6-45c7-bbed-667fd438a70b	'1x6':8 '8748':1 'british':5 'columbia':6 'road':3 'spruce':2 'surrey':4 'v4r3':7
3	Cozy Cottage	250000	https://images.unsplash.com/photo-1449844908441-8829872d2607	2025-06-29 00:30:39.932465	\N	f	93bc1c64-328d-49aa-825a-c35ff19bf00c	PROP-1751157039.932465-3	\N	craigpestell@gmail.com	\N	#10B981	4038	Elm Street	Unit 48	Surrey	British Columbia	V6L8 1E2	Canada	49.17652605	-122.87076926	4038 Elm Street, Unit 48, Surrey, British Columbia, V6L8 1E2, Canada	residential	4b1c8110-eeb6-45c7-bbed-667fd438a70b	'1e2':10 '4038':1 '48':5 'british':7 'columbia':8 'elm':2 'street':3 'surrey':6 'unit':4 'v6l8':9
15	Luxury Executive Estate	850000	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800	2025-07-05 16:13:32.859499	\N	f	bb64ce9a-6fce-444b-8a6f-d5a3731f0691	SEED-PROP-004	{"bedrooms": 5, "bathrooms": 4, "sqft": 4200, "propertyType": "House", "yearBuilt": 2015, "lotSize": "1.2 acres", "features": ["Gourmet kitchen", "Master suite with sitting area", "Home office", "3-car garage", "Swimming pool", "Wine cellar"], "description": "Exceptional custom-built home in prestigious Country Club neighborhood."}	seller2@example.com	\N	\N	8022	Maple Drive	Unit 38	West Vancouver	British Columbia	V7N7 9E9	Canada	49.32848789	-123.17219198	8022 Maple Drive, Unit 38, West Vancouver, British Columbia, V7N7 9E9, Canada	residential	79f5925d-dbf2-4754-95e3-8da4a18e522d	'38':5 '8022':1 '9e9':11 'british':8 'columbia':9 'drive':3 'mapl':2 'unit':4 'v7n7':10 'vancouv':7 'west':6
102	River North Industrial Loft	950000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2024-12-06 23:03:42.696198	\N	f	69f47c4c-fe5c-47b2-8ea6-1d3e4ff1bc41	chi_loft_242	{"bedrooms": 2, "bathrooms": 2, "sqft": 1600, "type": "Loft", "description": "Converted industrial loft in River North with exposed brick and city views."}	anna.novak@email.com	\N	\N	4045	Denman Street	\N	New Westminster	British Columbia	V5H6 9Z1	Canada	49.19269858	-122.90874278	4045 Denman Street, New Westminster, British Columbia, V5H6 9Z1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4045':1 '9z1':9 'british':6 'columbia':7 'denman':2 'new':4 'street':3 'v5h6':8 'westminst':5
103	Wicker Park Artist Haven	750000	https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800	2024-12-03 23:03:42.696198	\N	f	87c109a3-74e4-4bc8-9f5a-8b921994f87f	chi_house_243	{"bedrooms": 3, "bathrooms": 2, "sqft": 1800, "type": "House", "description": "Artistic home in vibrant Wicker Park with studio space and creative community."}	peter.jankowski@email.com	\N	\N	3028	Cambie Street	\N	West Vancouver	British Columbia	V3T8 5X2	Canada	49.32798982	-123.14613864	3028 Cambie Street, West Vancouver, British Columbia, V3T8 5X2, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'3028':1 '5x2':9 'british':6 'cambi':2 'columbia':7 'street':3 'v3t8':8 'vancouv':5 'west':4
104	Gold Coast Luxury High-Rise	2200000	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800	2024-11-30 23:03:42.696198	\N	f	d9dd2fcb-c1ee-4c48-b251-78742e78c077	chi_condo_244	{"bedrooms": 3, "bathrooms": 3, "sqft": 2100, "type": "Condo", "description": "Luxurious Gold Coast condo with Lake Michigan views and premium building amenities."}	maria.kowalczyk@email.com	\N	\N	5530	Fraser Street	Unit 9	Richmond	British Columbia	V3V7 1C4	Canada	49.17871794	-123.15693038	5530 Fraser Street, Unit 9, Richmond, British Columbia, V3V7 1C4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1c4':10 '5530':1 '9':5 'british':7 'columbia':8 'fraser':2 'richmond':6 'street':3 'unit':4 'v3v7':9
105	Logan Square Bungalow	650000	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	2024-11-27 23:03:42.696198	\N	f	8c6c87ca-3204-41dc-8269-92652e574f7f	chi_house_245	{"bedrooms": 3, "bathrooms": 2, "sqft": 1500, "type": "House", "description": "Charming Chicago bungalow in trendy Logan Square with hardwood floors and vintage charm."}	jan.wisniewski@email.com	\N	\N	1087	Birch Avenue	\N	West Vancouver	British Columbia	V5B3 6V7	Canada	49.34035224	-123.14504766	1087 Birch Avenue, West Vancouver, British Columbia, V5B3 6V7, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1087':1 '6v7':9 'avenu':3 'birch':2 'british':6 'columbia':7 'v5b3':8 'vancouv':5 'west':4
106	Bucktown Modern Townhouse	850000	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800	2024-11-24 23:03:42.696198	\N	f	7057328c-7a39-4791-9f32-5f80f57168dc	chi_apt_246	{"bedrooms": 3, "bathrooms": 3, "sqft": 1900, "type": "Townhouse", "description": "Contemporary townhouse in Bucktown with rooftop deck and designer finishes."}	katarzyna.zielinska@email.com	\N	\N	1810	Douglas Road	\N	Richmond	British Columbia	V3Y0 9H7	Canada	49.17262421	-123.15742329	1810 Douglas Road, Richmond, British Columbia, V3Y0 9H7, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1810':1 '9h7':8 'british':5 'columbia':6 'dougla':2 'richmond':4 'road':3 'v3y0':7
107	South Loop High-Rise	550000	https://images.unsplash.com/photo-1600607688066-890987cd4af7?w=800	2024-11-21 23:03:42.696198	\N	f	3e26de8f-7c29-4b02-8a5f-6bb816e698a6	chi_condo_247	{"bedrooms": 1, "bathrooms": 1, "sqft": 900, "type": "Condo", "description": "Modern South Loop condo with skyline views and convenient downtown location."}	andrzej.kowalski@email.com	\N	\N	1856	Cambie Street	Unit 3	Vancouver	British Columbia	V7V1 1R4	Canada	49.26052648	-123.15329651	1856 Cambie Street, Unit 3, Vancouver, British Columbia, V7V1 1R4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1856':1 '1r4':10 '3':5 'british':7 'cambi':2 'columbia':8 'street':3 'unit':4 'v7v1':9 'vancouv':6
108	Hyde Park Historic Mansion	1650000	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800	2024-11-18 23:03:42.696198	\N	f	6c9e8861-1baf-4375-b8cc-f49cb9885ea0	chi_house_248	{"bedrooms": 5, "bathrooms": 4, "sqft": 3500, "type": "House", "description": "Historic mansion in Hyde Park near University of Chicago with period architecture."}	magdalena.nowak@email.com	\N	\N	6017	Spruce Road	\N	Surrey	British Columbia	V7B9 4G1	Canada	49.16751708	-122.85168924	6017 Spruce Road, Surrey, British Columbia, V7B9 4G1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4g1':8 '6017':1 'british':5 'columbia':6 'road':3 'spruce':2 'surrey':4 'v7b9':7
109	West Loop Warehouse Conversion	1250000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2024-11-15 23:03:42.696198	\N	f	9a55e863-a18b-44ec-af6e-7e60aef80968	chi_loft_249	{"bedrooms": 2, "bathrooms": 2, "sqft": 1700, "type": "Loft", "description": "Stunning warehouse conversion in West Loop with high ceilings and modern amenities."}	pawel.krawczyk@email.com	\N	\N	9694	Oak Avenue	Unit 11	Vancouver	British Columbia	V6S1 4E0	Canada	49.31055393	-123.12160711	9694 Oak Avenue, Unit 11, Vancouver, British Columbia, V6S1 4E0, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'11':5 '4e0':10 '9694':1 'avenu':3 'british':7 'columbia':8 'oak':2 'unit':4 'v6s1':9 'vancouv':6
110	Streeterville Marina Views	1850000	https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800	2024-11-12 23:03:42.696198	\N	f	c9875d83-5001-4dfc-ab61-3970412db2c7	chi_condo_250	{"bedrooms": 2, "bathrooms": 2, "sqft": 1400, "type": "Condo", "description": "Elegant Streeterville condo with marina and lake views from floor-to-ceiling windows."}	agnieszka.lewandowska@email.com	\N	\N	7922	Fir Avenue	\N	Coquitlam	British Columbia	V6A2 8X3	Canada	49.28986285	-122.80445139	7922 Fir Avenue, Coquitlam, British Columbia, V6A2 8X3, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'7922':1 '8x3':8 'avenu':3 'british':5 'columbia':6 'coquitlam':4 'fir':2 'v6a2':7
111	Andersonville Swedish Heritage	550000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2024-11-09 23:03:42.696198	\N	f	869c6c96-b9f6-439a-85b8-fa7fa88553ab	chi_house_251	{"bedrooms": 2, "bathrooms": 2, "sqft": 1300, "type": "House", "description": "Charming home in historic Andersonville with Swedish heritage and community feel."}	tomasz.wojcik@email.com	\N	\N	2738	Commercial Drive	\N	Vancouver	British Columbia	V4Y8 9C8	Canada	49.27895283	-123.08752641	2738 Commercial Drive, Vancouver, British Columbia, V4Y8 9C8, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2738':1 '9c8':8 'british':5 'columbia':6 'commerci':2 'drive':3 'v4y8':7 'vancouv':4
112	Old Town Historic District	1150000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2024-11-06 23:03:42.696198	\N	f	72b1ec3f-4cb7-4714-b371-a98b6a61f307	chi_apt_252	{"bedrooms": 2, "bathrooms": 2, "sqft": 1200, "type": "Condo", "description": "Historic Old Town condo with cobblestone streets and Second City proximity."}	krzysztof.kaminski@email.com	\N	\N	6578	Fraser Street	\N	Vancouver	British Columbia	V5T0 6V4	Canada	49.32040121	-123.07992569	6578 Fraser Street, Vancouver, British Columbia, V5T0 6V4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'6578':1 '6v4':8 'british':5 'columbia':6 'fraser':2 'street':3 'v5t0':7 'vancouv':4
113	Lakeview Family Home	750000	https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800	2024-11-03 23:03:42.696198	\N	f	f4cc9588-c744-46d2-8d35-380c793dd7ed	chi_house_253	{"bedrooms": 4, "bathrooms": 3, "sqft": 2200, "type": "House", "description": "Family-friendly home in Lakeview with yard and close to Wrigley Field."}	barbara.szymanska@email.com	\N	\N	6657	Oak Avenue	\N	Vancouver	British Columbia	V7B3 8M3	Canada	49.26072244	-123.16478240	6657 Oak Avenue, Vancouver, British Columbia, V7B3 8M3, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'6657':1 '8m3':8 'avenu':3 'british':5 'columbia':6 'oak':2 'v7b3':7 'vancouv':4
114	Lincoln Square German Heritage	450000	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	2024-10-31 23:03:42.696198	\N	f	8ccf100d-e383-4229-896e-de9e82590622	chi_condo_254	{"bedrooms": 2, "bathrooms": 1, "sqft": 1000, "type": "Condo", "description": "Affordable condo in Lincoln Square with German heritage and community atmosphere."}	stanislaw.dabrowska@email.com	\N	\N	7005	Hemlock Street	\N	Burnaby	British Columbia	V6N2 6Z8	Canada	49.27222978	-122.98352099	7005 Hemlock Street, Burnaby, British Columbia, V6N2 6Z8, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'6z8':8 '7005':1 'british':5 'burnabi':4 'columbia':6 'hemlock':2 'street':3 'v6n2':7
1	Modern Family Home	450000	https://images.unsplash.com/photo-1506744038136-46273834b3fb	2025-06-29 00:30:39.932465	\N	f	4264b267-34c7-41fe-bc3d-097ee22164d7	PROP-1751157039.932465-1	\N	craigpestell@gmail.com	\N	#3B82F6	2335	Davie Street	\N	West Vancouver	British Columbia	V6K2 6X5	Canada	49.33179749	-123.15586511	2335 Davie Street, West Vancouver, British Columbia, V6K2 6X5, Canada	residential	4b1c8110-eeb6-45c7-bbed-667fd438a70b	'2335':1 '6x5':9 'british':6 'columbia':7 'davi':2 'street':3 'v6k2':8 'vancouv':5 'west':4
13	Modern Downtown Loft	275000	https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800	2025-07-05 16:13:32.859499	\N	f	527d3777-913a-4feb-81c1-62ba0749bcbd	SEED-PROP-002	{"bedrooms": 2, "bathrooms": 2, "sqft": 1100, "propertyType": "Condo", "yearBuilt": 2018, "features": ["Open floor plan", "Floor-to-ceiling windows", "Stainless steel appliances", "In-unit laundry", "Rooftop terrace access"], "description": "Contemporary loft living in the heart of downtown with stunning city views."}	seller1@example.com	\N	#F59E42	8413	Cambie Street	Unit 12	Vancouver	British Columbia	V6V7 1N7	Canada	49.30698374	-123.09260177	8413 Cambie Street, Unit 12, Vancouver, British Columbia, V6V7 1N7, Canada	residential	06cbc493-8742-4a5f-9f74-df17dea9065b	'12':5 '1n7':10 '8413':1 'british':7 'cambi':2 'columbia':8 'street':3 'unit':4 'v6v7':9 'vancouv':6
12	Stunning Victorian Family Home	485000	https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800	2025-07-05 16:13:32.859499	\N	f	aae8120a-6c3a-4e48-851a-1067a62071ef	SEED-PROP-001	{"bedrooms": 4, "bathrooms": 3, "sqft": 2400, "propertyType": "House", "yearBuilt": 1895, "lotSize": "0.25 acres", "features": ["Hardwood floors", "Original crown molding", "Updated kitchen", "Wrap-around porch", "Detached garage"], "description": "Beautifully restored Victorian home with modern amenities while preserving historic charm."}	seller1@example.com	\N	#A3E635	8702	Fir Avenue	\N	Coquitlam	British Columbia	V6M4 4L9	Canada	49.29042571	-122.79193668	8702 Fir Avenue, Coquitlam, British Columbia, V6M4 4L9, Canada	residential	06cbc493-8742-4a5f-9f74-df17dea9065b	'4l9':8 '8702':1 'avenu':3 'british':5 'columbia':6 'coquitlam':4 'fir':2 'v6m4':7
8	Cozy Lake Cabin	250000	https://images.unsplash.com/photo-1449844908441-8829872d2607	2025-06-29 02:02:02.632568	1	t	b146d9f7-3e7c-4675-a31e-77fce28a9ac1	PROP-1751162522.632568-8	\N	craigpestell@gmail.com	\N	\N	604	Denman Street	\N	Surrey	British Columbia	V3L0 1G0	Canada	49.17198059	-122.86234493	604 Denman Street, Surrey, British Columbia, V3L0 1G0, Canada	residential	4b1c8110-eeb6-45c7-bbed-667fd438a70b	'1g0':8 '604':1 'british':5 'columbia':6 'denman':2 'street':3 'surrey':4 'v3l0':7
9	oaeueoauaoe	33333333	/uploads/fz1951ed6zzj3zujq2kk40vlw.jpg	2025-06-29 02:51:44.67592	1	t	670fc682-9086-4b84-98d5-639416fc4cb5	PROP-1751165504.675920-9	\N	craigpestell@gmail.com	\N	\N	8835	Cambie Street	Unit 11	North Vancouver	British Columbia	V6R4 1Y3	Canada	49.33098257	-123.09437421	8835 Cambie Street, Unit 11, North Vancouver, British Columbia, V6R4 1Y3, Canada	residential	4b1c8110-eeb6-45c7-bbed-667fd438a70b	'11':5 '1y3':11 '8835':1 'british':8 'cambi':2 'columbia':9 'north':6 'street':3 'unit':4 'v6r4':10 'vancouv':7
7	Downtown Loft Apartment sth	475000	/uploads/kcqcs74zrgmbgz6twd4lebmpy.jpg	2025-06-29 02:02:02.632568	1	t	1b5cba5b-d35b-42b1-bdf2-6873edea620b	PROP-1751162522.632568-7	\N	craigpestell@gmail.com	\N	\N	4142	Douglas Road	\N	Richmond	British Columbia	V6M2 5G0	Canada	49.17678121	-123.12333502	4142 Douglas Road, Richmond, British Columbia, V6M2 5G0, Canada	residential	4b1c8110-eeb6-45c7-bbed-667fd438a70b	'4142':1 '5g0':8 'british':5 'columbia':6 'dougla':2 'richmond':4 'road':3 'v6m2':7
11	Cool spot	180000	/uploads/jgb5wdxlnc58ghqkhcamxp277.jpeg	2025-07-05 15:08:56.576183	2	f	c59a5134-ac22-4612-8e74-aea5b49f51e9	PROP-MCQSPH4Q-9A6VOR	{"propertyType":"condo","bedrooms":2,"bathrooms":1,"squareFootage":800,"yearBuilt":1967,"description":"It's nice"}	craigpestell@gmail.com	\N	\N	5301	Willow Way	\N	Richmond	British Columbia	V6R9 5B9	Canada	49.18574141	-123.11271360	5301 Willow Way, Richmond, British Columbia, V6R9 5B9, Canada	residential	4b1c8110-eeb6-45c7-bbed-667fd438a70b	'5301':1 '5b9':8 'british':5 'columbia':6 'richmond':4 'v6r9':7 'way':3 'willow':2
16	Cozy Suburban Ranch	320000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2025-07-05 16:13:32.859499	\N	f	d2402110-0f6d-45b4-9f76-e44d3e09df02	SEED-PROP-005	{"bedrooms": 3, "bathrooms": 2, "sqft": 1650, "propertyType": "House", "yearBuilt": 1978, "lotSize": "0.3 acres", "features": ["Split-level design", "Finished basement", "Screened porch", "2-car garage", "Mature landscaping"], "description": "Well-maintained family home in quiet neighborhood with excellent schools."}	seller2@example.com	\N	\N	3255	Willow Way	\N	Richmond	British Columbia	V5B8 2S3	Canada	49.19089528	-123.14511838	3255 Willow Way, Richmond, British Columbia, V5B8 2S3, Canada	residential	79f5925d-dbf2-4754-95e3-8da4a18e522d	'2s3':8 '3255':1 'british':5 'columbia':6 'richmond':4 'v5b8':7 'way':3 'willow':2
32	Battery Park City Family Home	2750000	https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800	2025-07-03 23:03:34.188523	\N	f	4e9e115b-4a07-4f20-80bd-35f5b41c3322	ny_apt_172	{"bedrooms": 3, "bathrooms": 2, "sqft": 1900, "type": "Condo", "description": "Family-friendly condo in Battery Park City with Hudson River views."}	giovanni.rossi@email.com	\N	\N	3586	Maple Drive	Unit 24	Vancouver	British Columbia	V4P1 9G6	Canada	49.30159588	-123.13901473	3586 Maple Drive, Unit 24, Vancouver, British Columbia, V4P1 9G6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'24':5 '3586':1 '9g6':10 'british':7 'columbia':8 'drive':3 'mapl':2 'unit':4 'v4p1':9 'vancouv':6
33	Midtown East Corporate Housing	1750000	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800	2025-07-01 23:03:34.188523	\N	f	3cfab5cb-e853-4c78-bd1b-395dc1c5057b	ny_apt_173	{"bedrooms": 2, "bathrooms": 2, "sqft": 1200, "type": "Condo", "description": "Modern condo perfect for corporate housing in convenient Midtown location."}	hans.mueller@email.com	\N	\N	4117	Cedar Lane	Unit 17	Coquitlam	British Columbia	V5N1 3S3	Canada	49.28250686	-122.79577246	4117 Cedar Lane, Unit 17, Coquitlam, British Columbia, V5N1 3S3, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'17':5 '3s3':10 '4117':1 'british':7 'cedar':2 'columbia':8 'coquitlam':6 'lane':3 'unit':4 'v5n1':9
20	cute cottage	495000	/uploads/mzkepi110wk16btcff2oiv7fe.2e16d0ba.fill	2025-07-05 18:46:06.3373	5	f	f1dc48a8-4a1b-4f1c-80f0-ac24e7019814	PROP-MCR0GQYK-PHVQPI	{"propertyType":"house","bedrooms":2,"bathrooms":1,"squareFootage":1240,"yearBuilt":1959,"description":" The image showcases an elegant two-story residential property nestled amidst lush greenery and rock formations. This modern house, constructed from stone with a distinctive flat roof, stands as a testament to the fusion of natural materials with contemporary design elements. The architectural style is characterized by clean lines, large windows that flood the interior with light, and thoughtful landscaping that enhances its appeal.\\n\\nThe exterior features a warm brown siding that complements the stone accents. A large deck with glass railings extends from the second story, offering panoramic views of the surrounding landscape. The property is further enhanced by a front porch, ideal for quiet evenings or enjoying morning coffee.\\n\\nThe landscaping is meticulously maintained, with mature trees and shrubs framing the entrance and providing privacy. Stonework details add texture and depth to the home's exterior, while thoughtful landscaping contributes to its serene ambiance.\\n\\nOverall, this property presents an inviting living space that offers both a retreat from the hustle and bustle of urban life and a connection to nature. The home's modern design and attention to detail make it an attractive option for those seeking a harmonious blend of functionality and aesthetic appeal. Notable features such as the large windows, spacious deck, and well-manicured landscaping are sure to draw in potential buyers who value comfort, style, and tranquility. "}	seller1@example.com	\N	#10B981	8232	Birch Avenue	\N	North Vancouver	British Columbia	V6T0 1S0	Canada	49.31189291	-123.09981127	8232 Birch Avenue, North Vancouver, British Columbia, V6T0 1S0, Canada	residential	06cbc493-8742-4a5f-9f74-df17dea9065b	'1s0':9 '8232':1 'avenu':3 'birch':2 'british':6 'columbia':7 'north':4 'v6t0':8 'vancouv':5
17	Urban Townhouse	395000	https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800	2025-07-05 16:13:32.859499	\N	f	5a130476-7d53-4308-b0f6-4d7b8f804d8a	SEED-PROP-006	{"bedrooms": 3, "bathrooms": 2, "sqft": 1800, "propertyType": "Townhouse", "yearBuilt": 2010, "features": ["Two-story layout", "Private patio", "Attached garage", "Modern finishes", "Walking distance to park"], "description": "Contemporary townhouse offering low-maintenance living near downtown amenities."}	seller2@example.com	\N	\N	8452	Denman Street	\N	Richmond	British Columbia	V3L4 9Z8	Canada	49.16257948	-123.15383681	8452 Denman Street, Richmond, British Columbia, V3L4 9Z8, Canada	residential	79f5925d-dbf2-4754-95e3-8da4a18e522d	'8452':1 '9z8':8 'british':5 'columbia':6 'denman':2 'richmond':4 'street':3 'v3l4':7
18	Investment Duplex	225000	https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800	2025-07-05 16:13:32.859499	\N	f	f739e955-6283-4978-ab8e-53dcd2401742	SEED-PROP-007	{"bedrooms": 4, "bathrooms": 2, "sqft": 1600, "propertyType": "Multi-family", "yearBuilt": 1965, "units": 2, "features": ["Separate entrances", "Updated electrical", "Off-street parking", "Good rental history"], "description": "Excellent investment opportunity with stable rental income from both units."}	agent1@example.com	\N	\N	6203	Pine Road	Unit 26	North Vancouver	British Columbia	V3J0 9P2	Canada	49.30488008	-123.08902337	6203 Pine Road, Unit 26, North Vancouver, British Columbia, V3J0 9P2, Canada	residential	a00dec9d-1c2c-4423-a1df-372ecc2f5a2d	'26':5 '6203':1 '9p2':11 'british':8 'columbia':9 'north':6 'pine':2 'road':3 'unit':4 'v3j0':10 'vancouv':7
19	Renovated Bungalow	165000	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800	2025-07-05 16:13:32.859499	\N	f	22077fe5-9688-4dd2-b417-6d6a98e31bff	SEED-PROP-008	{"bedrooms": 2, "bathrooms": 1, "sqft": 1000, "propertyType": "House", "yearBuilt": 1940, "lotSize": "0.12 acres", "features": ["Recently renovated", "New roof", "Updated kitchen", "Hardwood floors", "Large front porch"], "description": "Completely renovated bungalow ready for immediate occupancy."}	agent1@example.com	\N	\N	5052	Maple Drive	Unit 4	North Vancouver	British Columbia	V4H4 8X4	Canada	49.32889381	-123.09470270	5052 Maple Drive, Unit 4, North Vancouver, British Columbia, V4H4 8X4, Canada	residential	a00dec9d-1c2c-4423-a1df-372ecc2f5a2d	'4':5 '5052':1 '8x4':11 'british':8 'columbia':9 'drive':3 'mapl':2 'north':6 'unit':4 'v4h4':10 'vancouv':7
14	Charming Cottage Retreat	195000	https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800	2025-07-05 16:13:32.859499	\N	f	c21b2432-48ea-4b11-b9eb-fefbebb857ad	SEED-PROP-003	{"bedrooms": 2, "bathrooms": 1, "sqft": 900, "propertyType": "House", "yearBuilt": 1952, "lotSize": "0.15 acres", "features": ["Cozy fireplace", "Updated bathroom", "Large backyard", "Garden shed", "Covered patio"], "description": "Perfect starter home or investment property with character and potential."}	seller1@example.com	\N	#6EE7B7	1316	Denman Street	Unit 16	West Vancouver	British Columbia	V6T9 5S1	Canada	49.33139782	-123.16667952	1316 Denman Street, Unit 16, West Vancouver, British Columbia, V6T9 5S1, Canada	residential	06cbc493-8742-4a5f-9f74-df17dea9065b	'1316':1 '16':5 '5s1':11 'british':8 'columbia':9 'denman':2 'street':3 'unit':4 'v6t9':10 'vancouv':7 'west':6
183	Charming 3-Bedroom House in Surrey	120000	/uploads/zp6yccxqqizac30i9ilnwv4hg.webp	2025-07-06 14:20:55.014166	5	f	20bf7308-cf2b-422f-aaa1-56c0ac7c3143	PROP-MCS6FKDA-67EV2T	{"propertyType":"house","bedrooms":3,"bathrooms":2,"squareFootage":700,"yearBuilt":1985,"description":"This single-story house in Surrey offers a spacious living area, three bedrooms, and two bathrooms. The exterior features a wooden porch, while the interior boasts large windows that allow plenty of natural light into the home. A carport is also available for additional storage space. The property is situated on a quiet street within a family-friendly neighborhood with access to excellent schools, shopping centers, and parks."}	seller1@example.com	\N	#6366F1	9756	Pine Road	Unit 20	Richmond	British Columbia	V6S5 8K5	Canada	49.14220591	-123.14398959	9756 Pine Road, Unit 20, Richmond, British Columbia, V6S5 8K5, Canada	residential	06cbc493-8742-4a5f-9f74-df17dea9065b	'20':5 '8k5':10 '9756':1 'british':7 'columbia':8 'pine':2 'richmond':6 'road':3 'unit':4 'v6s5':9
184	Modern Luxury Residence with Private Swimming Pool in Surrey	2500000	/uploads/stfp45lu17gmu1fbem16gi642.webp	2025-07-06 17:23:43.882662	5	f	e4effcf3-2a07-4e37-81c7-83c94b4e20a7	PROP-MCSCYO04-SS2BC3	{"propertyType":"house","bedrooms":4,"bathrooms":3,"squareFootage":5000,"yearBuilt":1950,"description":"This luxurious residence exudes sophistication and modern elegance. Situated on a quiet residential street in Surrey, it offers a serene retreat for those seeking upscale living. The property features a spacious open-concept layout with high ceilings and large windows that flood the space with natural light, while a grand entryway sets the stage for an unforgettable living experience."}	seller1@example.com	\N	\N	2071	Birch Avenue	Apt 16	Burnaby	British Columbia	V7V7 9R4	Canada	49.25174195	-122.98558441	2071 Birch Avenue, Apt 16, Burnaby, British Columbia, V7V7 9R4, Canada	residential	06cbc493-8742-4a5f-9f74-df17dea9065b	'16':5 '2071':1 '9r4':10 'apt':4 'avenu':3 'birch':2 'british':7 'burnabi':6 'columbia':8 'v7v7':9
27	Williamsburg Warehouse Conversion	1650000	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800	2025-06-26 23:03:34.188523	\N	f	a677081b-8578-4e21-897e-82c235246d11	ny_apt_167	{"bedrooms": 2, "bathrooms": 2, "sqft": 1500, "type": "Loft", "description": "Stylish warehouse conversion in trendy Williamsburg with Manhattan views."}	elena.vasquez@email.com	\N	\N	9707	Cambie Street	Unit 1	Vancouver	British Columbia	V7M4 7R2	Canada	49.31873084	-123.12631981	9707 Cambie Street, Unit 1, Vancouver, British Columbia, V7M4 7R2, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1':5 '7r2':10 '9707':1 'british':7 'cambi':2 'columbia':8 'street':3 'unit':4 'v7m4':9 'vancouv':6
28	Upper West Side Classic Six	2900000	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800	2025-06-29 23:03:34.188523	\N	f	d1cb60b0-5d1c-489a-8a3d-5b69d70d31e5	ny_apt_168	{"bedrooms": 3, "bathrooms": 2, "sqft": 1800, "type": "Apartment", "description": "Pre-war classic six with Central Park views and original architectural details."}	dmitri.volkov@email.com	\N	\N	3562	Maple Drive	\N	West Vancouver	British Columbia	V4C5 5S5	Canada	49.33625963	-123.16584948	3562 Maple Drive, West Vancouver, British Columbia, V4C5 5S5, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'3562':1 '5s5':9 'british':6 'columbia':7 'drive':3 'mapl':2 'v4c5':8 'vancouv':5 'west':4
29	Chelsea Modern Studio	950000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2025-07-02 23:03:34.188523	\N	f	ad3ab616-380f-4105-b8ac-5739a4cf2988	ny_apt_169	{"bedrooms": 1, "bathrooms": 1, "sqft": 650, "type": "Studio", "description": "Sleek modern studio in Chelsea with floor-to-ceiling windows and luxury finishes."}	isabelle.laurent@email.com	\N	\N	2424	Douglas Road	Apt 12	North Vancouver	British Columbia	V7E1 5K9	Canada	49.32793320	-123.08173224	2424 Douglas Road, Apt 12, North Vancouver, British Columbia, V7E1 5K9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'12':5 '2424':1 '5k9':11 'apt':4 'british':8 'columbia':9 'dougla':2 'north':6 'road':3 'v7e1':10 'vancouv':7
30	East Village Walkup Charm	875000	https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800	2025-07-04 23:03:34.188523	\N	f	a092ae9e-4a07-42a2-84f3-a3f0ae0f076c	ny_apt_170	{"bedrooms": 1, "bathrooms": 1, "sqft": 750, "type": "Apartment", "description": "Charming walk-up apartment in heart of East Village with exposed brick."}	pierre.dubois@email.com	\N	\N	543	Maple Drive	\N	Burnaby	British Columbia	V6C5 3T1	Canada	49.24548350	-123.00284238	543 Maple Drive, Burnaby, British Columbia, V6C5 3T1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'3t1':8 '543':1 'british':5 'burnabi':4 'columbia':6 'drive':3 'mapl':2 'v6c5':7
34	Nolita Boutique Building	1950000	https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800	2025-06-28 23:03:34.188523	\N	f	eed914b1-49fc-4b67-8e3e-cbb0fa1c2210	ny_apt_174	{"bedrooms": 2, "bathrooms": 2, "sqft": 1300, "type": "Condo", "description": "Stylish condo in boutique Nolita building with private outdoor space."}	camille.bernard@email.com	\N	\N	7994	Spruce Road	Unit 7	Vancouver	British Columbia	V7M8 4J1	Canada	49.31334511	-123.14417068	7994 Spruce Road, Unit 7, Vancouver, British Columbia, V7M8 4J1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4j1':10 '7':5 '7994':1 'british':7 'columbia':8 'road':3 'spruce':2 'unit':4 'v7m8':9 'vancouv':6
35	Financial District High-Rise	1450000	https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800	2025-06-25 23:03:34.188523	\N	f	455b33d8-5fd7-41ba-b63c-8b73b34899f3	ny_apt_175	{"bedrooms": 1, "bathrooms": 1, "sqft": 900, "type": "Condo", "description": "Modern high-rise condo in Financial District with harbor views."}	yuki.tanaka@email.com	\N	\N	9574	Douglas Road	Unit 15	Vancouver	British Columbia	V3A7 2T1	Canada	49.23659958	-123.12728288	9574 Douglas Road, Unit 15, Vancouver, British Columbia, V3A7 2T1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'15':5 '2t1':10 '9574':1 'british':7 'columbia':8 'dougla':2 'road':3 'unit':4 'v3a7':9 'vancouv':6
36	Meatpacking District Penthouse	6800000	https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800	2025-06-22 23:03:34.188523	\N	f	27f23e3d-fa28-4fbd-911e-5ba78ea96929	ny_apt_176	{"bedrooms": 4, "bathrooms": 4, "sqft": 3500, "type": "Penthouse", "description": "Ultra-luxury penthouse in Meatpacking District with private terrace and city views."}	alessandro.conti@email.com	\N	\N	120	Denman Street	\N	Vancouver	British Columbia	V6H3 9P6	Canada	49.24884791	-123.14109376	120 Denman Street, Vancouver, British Columbia, V6H3 9P6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'120':1 '9p6':8 'british':5 'columbia':6 'denman':2 'street':3 'v6h3':7 'vancouv':4
37	Gramercy Park Historic	3200000	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800	2025-06-19 23:03:34.188523	\N	f	82fc2410-561d-4e8f-bde9-5402a87bed33	ny_apt_177	{"bedrooms": 3, "bathrooms": 2, "sqft": 2000, "type": "Coop", "description": "Historic co-op with Gramercy Park key and classic Manhattan elegance."}	lucia.martinez@email.com	\N	\N	2981	Commercial Drive	Unit 24	Surrey	British Columbia	V6X6 7N8	Canada	49.19182699	-122.86285144	2981 Commercial Drive, Unit 24, Surrey, British Columbia, V6X6 7N8, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'24':5 '2981':1 '7n8':10 'british':7 'columbia':8 'commerci':2 'drive':3 'surrey':6 'unit':4 'v6x6':9
38	Hell's Kitchen Modern	1350000	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	2025-06-16 23:03:34.188523	\N	f	79471364-4957-4c3a-9001-7cd9db1c48bf	ny_apt_178	{"bedrooms": 2, "bathrooms": 2, "sqft": 1100, "type": "Condo", "description": "Contemporary condo in Hell's Kitchen with Hudson River views and modern amenities."}	erik.andersen@email.com	\N	\N	1220	Willow Way	Unit 18	Burnaby	British Columbia	V4C1 7W7	Canada	49.22701938	-122.98588793	1220 Willow Way, Unit 18, Burnaby, British Columbia, V4C1 7W7, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1220':1 '18':5 '7w7':10 'british':7 'burnabi':6 'columbia':8 'unit':4 'v4c1':9 'way':3 'willow':2
39	Murray Hill Classic	1150000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2025-06-13 23:03:34.188523	\N	f	4e5874d8-3fc5-408c-947d-63d362d6af88	ny_apt_179	{"bedrooms": 1, "bathrooms": 1, "sqft": 800, "type": "Condo", "description": "Classic pre-war charm meets modern convenience in Murray Hill location."}	ingrid.larsson@email.com	\N	\N	5140	Commercial Drive	Unit 13	North Vancouver	British Columbia	V5R8 2R8	Canada	49.32036950	-123.08749757	5140 Commercial Drive, Unit 13, North Vancouver, British Columbia, V5R8 2R8, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'13':5 '2r8':11 '5140':1 'british':8 'columbia':9 'commerci':2 'drive':3 'north':6 'unit':4 'v5r8':10 'vancouv':7
40	Long Island City Waterfront	1250000	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800	2025-06-10 23:03:34.188523	\N	f	f16087e7-fd01-410d-b274-3e5e100e669c	ny_apt_180	{"bedrooms": 2, "bathrooms": 2, "sqft": 1300, "type": "Condo", "description": "Modern waterfront condo in LIC with Manhattan skyline views and resort-style amenities."}	olaf.peterson@email.com	\N	\N	210	Elm Street	Apt 15	Burnaby	British Columbia	V3P1 4Z0	Canada	49.24053910	-122.97057459	210 Elm Street, Apt 15, Burnaby, British Columbia, V3P1 4Z0, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'15':5 '210':1 '4z0':10 'apt':4 'british':7 'burnabi':6 'columbia':8 'elm':2 'street':3 'v3p1':9
41	Dumbo Bridge Views	2100000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2025-06-07 23:03:34.188523	\N	f	fa729af4-579a-4db8-9b6f-af8f0b1a8f8e	ny_apt_181	{"bedrooms": 2, "bathrooms": 2, "sqft": 1400, "type": "Condo", "description": "Stunning condo in Dumbo with Brooklyn Bridge views and cobblestone charm."}	maya.patel@email.com	\N	\N	8978	Fraser Street	Apt 2	Vancouver	British Columbia	V5W8 9J1	Canada	49.29498524	-123.10759923	8978 Fraser Street, Apt 2, Vancouver, British Columbia, V5W8 9J1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2':5 '8978':1 '9j1':10 'apt':4 'british':7 'columbia':8 'fraser':2 'street':3 'v5w8':9 'vancouv':6
42	Park Slope Brownstone	1850000	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800	2025-06-04 23:03:34.188523	\N	f	16c3c5d9-2c96-432f-a036-d950c654cd5e	ny_apt_182	{"bedrooms": 3, "bathrooms": 2, "sqft": 1600, "type": "Condo", "description": "Beautiful brownstone conversion in desirable Park Slope with original details."}	finn.nielsen@email.com	\N	\N	2906	Hemlock Street	\N	New Westminster	British Columbia	V7S0 5G7	Canada	49.21902095	-122.89742675	2906 Hemlock Street, New Westminster, British Columbia, V7S0 5G7, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2906':1 '5g7':9 'british':6 'columbia':7 'hemlock':2 'new':4 'street':3 'v7s0':8 'westminst':5
43	Red Hook Warehouse Loft	1450000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2025-06-01 23:03:34.188523	\N	f	bd1ca4b9-2203-4db2-83d5-c68a92708b4f	ny_apt_183	{"bedrooms": 2, "bathrooms": 2, "sqft": 1800, "type": "Loft", "description": "Converted warehouse loft in Red Hook with harbor views and industrial character."}	astrid.johansen@email.com	\N	\N	1895	Hemlock Street	\N	Vancouver	British Columbia	V4S7 2G7	Canada	49.27956024	-123.12493061	1895 Hemlock Street, Vancouver, British Columbia, V4S7 2G7, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1895':1 '2g7':8 'british':5 'columbia':6 'hemlock':2 'street':3 'v4s7':7 'vancouv':4
44	Crown Heights Victorian	950000	https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800	2025-05-29 23:03:34.188523	\N	f	1493b010-1759-4a03-b04c-2926e52a9e83	ny_apt_184	{"bedrooms": 3, "bathrooms": 2, "sqft": 1500, "type": "House", "description": "Restored Victorian home in Crown Heights with period details and modern updates."}	lars.eriksson@email.com	\N	\N	8588	Granville Street	Unit 1	Coquitlam	British Columbia	V3W7 2K2	Canada	49.28820059	-122.79177802	8588 Granville Street, Unit 1, Coquitlam, British Columbia, V3W7 2K2, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1':5 '2k2':10 '8588':1 'british':7 'columbia':8 'coquitlam':6 'granvill':2 'street':3 'unit':4 'v3w7':9
45	Prospect Heights Modern	1650000	https://images.unsplash.com/photo-1600607688066-890987cd4af7?w=800	2025-05-26 23:03:34.188523	\N	f	132f5f0a-131f-417c-acdf-4d75a95a50b1	ny_apt_185	{"bedrooms": 2, "bathrooms": 2, "sqft": 1200, "type": "Condo", "description": "Contemporary condo in Prospect Heights near Barclays Center and Prospect Park."}	nora.hansen@email.com	\N	\N	101	Pine Road	\N	North Vancouver	British Columbia	V4T6 3R0	Canada	49.30378504	-123.08849655	101 Pine Road, North Vancouver, British Columbia, V4T6 3R0, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'101':1 '3r0':9 'british':6 'columbia':7 'north':4 'pine':2 'road':3 'v4t6':8 'vancouv':5
46	Cobble Hill Townhouse	3500000	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800	2025-05-23 23:03:34.188523	\N	f	1267310d-03f2-4a12-979e-a279348532d5	ny_apt_186	{"bedrooms": 4, "bathrooms": 3, "sqft": 2500, "type": "Townhouse", "description": "Historic townhouse in charming Cobble Hill with garden and original features."}	soren.andersen@email.com	\N	\N	8878	Robson Street	\N	Richmond	British Columbia	V3K7 7M8	Canada	49.14243574	-123.12419778	8878 Robson Street, Richmond, British Columbia, V3K7 7M8, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'7m8':8 '8878':1 'british':5 'columbia':6 'richmond':4 'robson':2 'street':3 'v3k7':7
47	Gowanus Canal Views	1350000	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	2025-05-20 23:03:34.188523	\N	f	8f9f6ddc-8b79-4394-9d39-f3ced9badc12	ny_apt_187	{"bedrooms": 2, "bathrooms": 2, "sqft": 1300, "type": "Condo", "description": "Modern condo overlooking Gowanus Canal in rapidly developing neighborhood."}	bjorn.karlsson@email.com	\N	\N	4477	Cherry Street	\N	Coquitlam	British Columbia	V7R8 8E9	Canada	49.27609838	-122.78024469	4477 Cherry Street, Coquitlam, British Columbia, V7R8 8E9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4477':1 '8e9':8 'british':5 'cherri':2 'columbia':6 'coquitlam':4 'street':3 'v7r8':7
48	Fort Greene Historic District	1550000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2025-05-17 23:03:34.188523	\N	f	fb6425d0-70fa-422a-9874-c3ad1c09b3a9	ny_apt_188	{"bedrooms": 2, "bathrooms": 1, "sqft": 1100, "type": "Condo", "description": "Historic building conversion in Fort Greene with modern amenities and period charm."}	inga.olsen@email.com	\N	\N	5860	Denman Street	\N	Vancouver	British Columbia	V3T5 7J6	Canada	49.32018566	-123.07511940	5860 Denman Street, Vancouver, British Columbia, V3T5 7J6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'5860':1 '7j6':8 'british':5 'columbia':6 'denman':2 'street':3 'v3t5':7 'vancouv':4
49	Greenpoint Industrial	1250000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2025-05-14 23:03:34.188523	\N	f	a93dfeb7-1b79-4963-928c-08631847286d	ny_apt_189	{"bedrooms": 2, "bathrooms": 2, "sqft": 1400, "type": "Loft", "description": "Industrial loft in Greenpoint with Manhattan views and artist-friendly space."}	tor.lindgren@email.com	\N	\N	2566	Pine Road	\N	North Vancouver	British Columbia	V7L9 6S8	Canada	49.31102566	-123.10486732	2566 Pine Road, North Vancouver, British Columbia, V7L9 6S8, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2566':1 '6s8':9 'british':6 'columbia':7 'north':4 'pine':2 'road':3 'v7l9':8 'vancouv':5
50	Bay Ridge Family Home	1150000	https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800	2025-05-11 23:03:34.188523	\N	f	3014614e-72b1-4638-9180-0d52428e8ad0	ny_apt_190	{"bedrooms": 3, "bathrooms": 2, "sqft": 1600, "type": "House", "description": "Traditional family home in quiet Bay Ridge with yard and neighborhood charm."}	karin.berg@email.com	\N	\N	8859	Cambie Street	Unit 44	West Vancouver	British Columbia	V3R5 5E5	Canada	49.33481330	-123.15302135	8859 Cambie Street, Unit 44, West Vancouver, British Columbia, V3R5 5E5, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'44':5 '5e5':11 '8859':1 'british':8 'cambi':2 'columbia':9 'street':3 'unit':4 'v3r5':10 'vancouv':7 'west':6
51	Sunset Park Panoramic	850000	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800	2025-05-08 23:03:34.188523	\N	f	e772fd1b-07a2-4c3b-ba74-b84051ede24f	ny_apt_191	{"bedrooms": 2, "bathrooms": 1, "sqft": 1000, "type": "Condo", "description": "Affordable condo in Sunset Park with panoramic harbor and city views."}	gunnar.holm@email.com	\N	\N	9881	Spruce Road	Unit 6	Vancouver	British Columbia	V5Z3 4H9	Canada	49.30081242	-123.14221892	9881 Spruce Road, Unit 6, Vancouver, British Columbia, V5Z3 4H9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4h9':10 '6':5 '9881':1 'british':7 'columbia':8 'road':3 'spruce':2 'unit':4 'v5z3':9 'vancouv':6
52	Bushwick Artist Loft	750000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2025-05-05 23:03:34.188523	\N	f	57b11d56-61e2-4e52-8157-1beaaf0fa0c9	ny_apt_192	{"bedrooms": 1, "bathrooms": 1, "sqft": 1200, "type": "Loft", "description": "Raw artist loft in vibrant Bushwick with high ceilings and creative community."}	helga.svensson@email.com	\N	\N	6781	Birch Avenue	\N	New Westminster	British Columbia	V5K4 1J5	Canada	49.20082756	-122.90827861	6781 Birch Avenue, New Westminster, British Columbia, V5K4 1J5, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1j5':9 '6781':1 'avenu':3 'birch':2 'british':6 'columbia':7 'new':4 'v5k4':8 'westminst':5
53	Bed-Stuy Brownstone Duplex	1450000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2025-05-02 23:03:34.188523	\N	f	78c007f8-4066-4ebc-806a-60615b1cb042	ny_apt_193	{"bedrooms": 3, "bathrooms": 2, "sqft": 1700, "type": "Duplex", "description": "Duplex in restored Bed-Stuy brownstone with original details and modern kitchen."}	magna.thor@email.com	\N	\N	6116	Granville Street	\N	Vancouver	British Columbia	V5G1 8C8	Canada	49.29095571	-123.14852133	6116 Granville Street, Vancouver, British Columbia, V5G1 8C8, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'6116':1 '8c8':8 'british':5 'columbia':6 'granvill':2 'street':3 'v5g1':7 'vancouv':4
54	Carroll Gardens Garden Apartment	1650000	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800	2025-04-29 23:03:34.188523	\N	f	f46dbe93-382b-4cce-9967-ae94cd8db30e	ny_apt_194	{"bedrooms": 2, "bathrooms": 2, "sqft": 1300, "type": "Apartment", "description": "Garden apartment in historic Carroll Gardens with private outdoor space."}	freya.nielsen@email.com	\N	\N	5471	Robson Street	Unit 6	Richmond	British Columbia	V5E4 2M4	Canada	49.17982953	-123.14401222	5471 Robson Street, Unit 6, Richmond, British Columbia, V5E4 2M4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2m4':10 '5471':1 '6':5 'british':7 'columbia':8 'richmond':6 'robson':2 'street':3 'unit':4 'v5e4':9
55	Boerum Hill Modern	1750000	https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800	2025-04-26 23:03:34.188523	\N	f	93144395-a4e8-4940-bcdb-26b8b3f5079c	ny_apt_195	{"bedrooms": 2, "bathrooms": 2, "sqft": 1250, "type": "Condo", "description": "Contemporary condo in trendy Boerum Hill with rooftop access and modern finishes."}	erik.thorsen@email.com	\N	\N	956	Davie Street	Apt 16	Burnaby	British Columbia	V3L8 3B4	Canada	49.25514896	-122.99872982	956 Davie Street, Apt 16, Burnaby, British Columbia, V3L8 3B4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'16':5 '3b4':10 '956':1 'apt':4 'british':7 'burnabi':6 'columbia':8 'davi':2 'street':3 'v3l8':9
56	Clinton Hill Converted Church	2200000	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	2025-04-23 23:03:34.188523	\N	f	9ccfe111-0eda-4919-9d90-0c099678d8b4	ny_apt_196	{"bedrooms": 3, "bathrooms": 3, "sqft": 2000, "type": "Loft", "description": "Unique converted church loft in Clinton Hill with soaring ceilings and stained glass."}	astrid.berg@email.com	\N	\N	686	Maple Drive	Unit 40	Richmond	British Columbia	V4N4 4H0	Canada	49.14200269	-123.13539694	686 Maple Drive, Unit 40, Richmond, British Columbia, V4N4 4H0, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'40':5 '4h0':10 '686':1 'british':7 'columbia':8 'drive':3 'mapl':2 'richmond':6 'unit':4 'v4n4':9
57	Windsor Terrace Quiet Street	1350000	https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800	2025-04-20 23:03:34.188523	\N	f	4f4633c4-b80b-4562-bb3e-421cc9f0a3ec	ny_apt_197	{"bedrooms": 2, "bathrooms": 2, "sqft": 1200, "type": "Condo", "description": "Peaceful condo on quiet Windsor Terrace street near Prospect Park."}	lena.karlsen@email.com	\N	\N	3036	Cedar Lane	Unit 3	Vancouver	British Columbia	V7W7 3K3	Canada	49.31670195	-123.12635468	3036 Cedar Lane, Unit 3, Vancouver, British Columbia, V7W7 3K3, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'3':5 '3036':1 '3k3':10 'british':7 'cedar':2 'columbia':8 'lane':3 'unit':4 'v7w7':9 'vancouv':6
58	Dyker Heights Family Estate	1950000	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800	2025-04-17 23:03:34.188523	\N	f	4c1bfac0-fd44-4360-a766-94b8a679be44	ny_apt_198	{"bedrooms": 4, "bathrooms": 3, "sqft": 2200, "type": "House", "description": "Spacious family home in Dyker Heights with large yard and traditional design."}	magnus.lindqvist@email.com	\N	\N	818	Birch Avenue	Apt 16	Vancouver	British Columbia	V3N9 3R2	Canada	49.24154622	-123.08865530	818 Birch Avenue, Apt 16, Vancouver, British Columbia, V3N9 3R2, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'16':5 '3r2':10 '818':1 'apt':4 'avenu':3 'birch':2 'british':7 'columbia':8 'v3n9':9 'vancouv':6
59	Marine Park Waterfront	1150000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2025-04-14 23:03:34.188523	\N	f	6195d3ae-c001-4771-84c0-6edd6c1d1b95	ny_apt_199	{"bedrooms": 3, "bathrooms": 2, "sqft": 1500, "type": "House", "description": "Waterfront home in Marine Park with dock access and tranquil setting."}	liv.andersson@email.com	\N	\N	9712	Cambie Street	Unit 30	Richmond	British Columbia	V5M7 3G1	Canada	49.17818694	-123.14979676	9712 Cambie Street, Unit 30, Richmond, British Columbia, V5M7 3G1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'30':5 '3g1':10 '9712':1 'british':7 'cambi':2 'columbia':8 'richmond':6 'street':3 'unit':4 'v5m7':9
60	Queens LIC Modern Tower	1450000	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800	2025-04-11 23:03:34.188523	\N	f	e8e37ac3-4acb-4e89-9112-a3412b1669a8	ny_apt_200	{"bedrooms": 2, "bathrooms": 2, "sqft": 1100, "type": "Condo", "description": "Modern tower condo in LIC with Manhattan views and luxury amenities package."}	saga.eriksen@email.com	\N	\N	4896	Fir Avenue	\N	Burnaby	British Columbia	V7A4 5H6	Canada	49.25979005	-122.97265004	4896 Fir Avenue, Burnaby, British Columbia, V7A4 5H6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4896':1 '5h6':8 'avenu':3 'british':5 'burnabi':4 'columbia':6 'fir':2 'v7a4':7
61	South Beach Art Deco Penthouse	3200000	https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800	2025-04-08 23:03:34.188523	\N	f	24bcd358-098e-46c7-a5c2-b82fed91061a	mia_apt_201	{"bedrooms": 3, "bathrooms": 3, "sqft": 2200, "type": "Penthouse", "description": "Stunning Art Deco penthouse on Ocean Drive with panoramic ocean views."}	carlos.santos@email.com	\N	\N	6032	Spruce Road	\N	Burnaby	British Columbia	V5W5 4L1	Canada	49.26555244	-122.99648373	6032 Spruce Road, Burnaby, British Columbia, V5W5 4L1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4l1':8 '6032':1 'british':5 'burnabi':4 'columbia':6 'road':3 'spruce':2 'v5w5':7
62	Brickell Avenue High-Rise	850000	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	2025-04-05 23:03:34.188523	\N	f	4168cc2f-68d3-4ab9-bd97-88e2b12d9fee	mia_condo_202	{"bedrooms": 2, "bathrooms": 2, "sqft": 1200, "type": "Condo", "description": "Modern high-rise condo in Brickell with bay views and resort-style amenities."}	maria.rodriguez@email.com	\N	\N	5597	Davie Street	Apt 2	Vancouver	British Columbia	V4T4 6M2	Canada	49.27240179	-123.16126701	5597 Davie Street, Apt 2, Vancouver, British Columbia, V4T4 6M2, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2':5 '5597':1 '6m2':10 'apt':4 'british':7 'columbia':8 'davi':2 'street':3 'v4t4':9 'vancouv':6
63	Coral Gables Mediterranean	2400000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2025-04-02 23:03:34.188523	\N	f	8cbf8420-d7ad-4f36-a9a6-92c6581ff20c	mia_house_203	{"bedrooms": 4, "bathrooms": 4, "sqft": 3200, "type": "House", "description": "Elegant Mediterranean-style home in prestigious Coral Gables with pool and gardens."}	jose.fernandez@email.com	\N	\N	8299	Davie Street	\N	Vancouver	British Columbia	V5V8 6M0	Canada	49.32473835	-123.12222495	8299 Davie Street, Vancouver, British Columbia, V5V8 6M0, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'6m0':8 '8299':1 'british':5 'columbia':6 'davi':2 'street':3 'v5v8':7 'vancouv':4
64	Key Biscayne Oceanfront	1950000	https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800	2025-03-30 23:03:34.188523	\N	f	42eb62e8-c6e6-4457-9958-29718e088d3f	mia_condo_204	{"bedrooms": 3, "bathrooms": 3, "sqft": 1800, "type": "Condo", "description": "Luxurious oceanfront condo on Key Biscayne with private beach access."}	ana.lopez@email.com	\N	\N	2997	Elm Street	Unit 44	Coquitlam	British Columbia	V7J9 1L2	Canada	49.28127827	-122.78827550	2997 Elm Street, Unit 44, Coquitlam, British Columbia, V7J9 1L2, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1l2':10 '2997':1 '44':5 'british':7 'columbia':8 'coquitlam':6 'elm':2 'street':3 'unit':4 'v7j9':9
65	Coconut Grove Bayfront	4500000	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800	2025-03-27 23:03:34.188523	\N	f	ee5b8ac4-6b39-46fc-b0d0-c90a6980af95	mia_house_205	{"bedrooms": 5, "bathrooms": 5, "sqft": 4200, "type": "House", "description": "Magnificent bayfront estate in Coconut Grove with private dock and tropical landscaping."}	ricardo.morales@email.com	\N	\N	2423	Maple Drive	\N	Coquitlam	British Columbia	V6T7 7X6	Canada	49.28892374	-122.80761728	2423 Maple Drive, Coquitlam, British Columbia, V6T7 7X6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2423':1 '7x6':8 'british':5 'columbia':6 'coquitlam':4 'drive':3 'mapl':2 'v6t7':7
66	Wynwood Arts District Loft	650000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2025-03-24 23:03:34.188523	\N	f	0651062a-756d-4eac-bdfa-13c8fb94f878	mia_condo_206	{"bedrooms": 1, "bathrooms": 2, "sqft": 1000, "type": "Loft", "description": "Hip loft in Wynwood Arts District surrounded by galleries and street art."}	diego.herrera@email.com	\N	\N	4258	Cherry Street	\N	Richmond	British Columbia	V3T3 5S2	Canada	49.14820600	-123.12876905	4258 Cherry Street, Richmond, British Columbia, V3T3 5S2, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4258':1 '5s2':8 'british':5 'cherri':2 'columbia':6 'richmond':4 'street':3 'v3t3':7
67	Aventura Luxury Tower	1350000	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800	2025-03-21 23:03:34.188523	\N	f	69ae374b-bcb7-4b1b-83f4-ac67be7158f4	mia_condo_207	{"bedrooms": 2, "bathrooms": 2, "sqft": 1400, "type": "Condo", "description": "Upscale condo in Aventura with ocean views and world-class shopping nearby."}	fernanda.silva@email.com	\N	\N	2277	Spruce Road	Apt 10	Burnaby	British Columbia	V4H0 8X5	Canada	49.22580403	-122.98017528	2277 Spruce Road, Apt 10, Burnaby, British Columbia, V4H0 8X5, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'10':5 '2277':1 '8x5':10 'apt':4 'british':7 'burnabi':6 'columbia':8 'road':3 'spruce':2 'v4h0':9
68	Miami Beach Historic	2200000	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800	2025-03-18 23:03:34.188523	\N	f	eb3abc2b-ee30-4f25-92dd-23a15a33c409	mia_house_208	{"bedrooms": 3, "bathrooms": 3, "sqft": 2000, "type": "House", "description": "Restored historic home in Miami Beach with modern amenities and classic charm."}	pablo.gutierrez@email.com	\N	\N	7027	Elm Street	Unit 48	Vancouver	British Columbia	V3A2 7X8	Canada	49.26015702	-123.12550898	7027 Elm Street, Unit 48, Vancouver, British Columbia, V3A2 7X8, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'48':5 '7027':1 '7x8':10 'british':7 'columbia':8 'elm':2 'street':3 'unit':4 'v3a2':9 'vancouv':6
69	Downtown Miami Skyline Views	750000	https://images.unsplash.com/photo-1600607688066-890987cd4af7?w=800	2025-03-15 23:03:34.188523	\N	f	b8e834dd-a8d5-4e3b-8213-620153ecae55	mia_condo_209	{"bedrooms": 1, "bathrooms": 1, "sqft": 900, "type": "Condo", "description": "Modern condo in downtown Miami with spectacular skyline and bay views."}	valentina.castro@email.com	\N	\N	8813	Davie Street	Unit 3	North Vancouver	British Columbia	V7V0 4E4	Canada	49.31456706	-123.08451236	8813 Davie Street, Unit 3, North Vancouver, British Columbia, V7V0 4E4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'3':5 '4e4':11 '8813':1 'british':8 'columbia':9 'davi':2 'north':6 'street':3 'unit':4 'v7v0':10 'vancouv':7
70	Pinecrest Family Estate	1650000	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800	2025-03-12 23:03:34.188523	\N	f	9a3e830d-b2d4-4776-8e46-9becffbdc64c	mia_house_210	{"bedrooms": 4, "bathrooms": 3, "sqft": 2800, "type": "House", "description": "Spacious family home in Pinecrest with pool, large yard, and top-rated schools nearby."}	gabriel.mendoza@email.com	\N	\N	6576	Willow Way	\N	Burnaby	British Columbia	V7C5 9W9	Canada	49.26475108	-123.00505545	6576 Willow Way, Burnaby, British Columbia, V7C5 9W9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'6576':1 '9w9':8 'british':5 'burnabi':4 'columbia':6 'v7c5':7 'way':3 'willow':2
71	Bal Harbour Oceanfront Luxury	5500000	https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800	2025-03-09 23:03:34.188523	\N	f	fac7bbae-5ab5-4d76-9b4f-efa0da164f43	mia_condo_211	{"bedrooms": 4, "bathrooms": 4, "sqft": 3500, "type": "Penthouse", "description": "Ultra-luxury oceanfront penthouse in exclusive Bal Harbour with world-class amenities."}	isabella.vargas@email.com	\N	\N	4922	Oak Avenue	\N	Vancouver	British Columbia	V4M2 1A3	Canada	49.32508546	-123.08480130	4922 Oak Avenue, Vancouver, British Columbia, V4M2 1A3, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1a3':8 '4922':1 'avenu':3 'british':5 'columbia':6 'oak':2 'v4m2':7 'vancouv':4
72	Coral Gables Golf Course Home	3200000	https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800	2025-03-06 23:03:34.188523	\N	f	0023700c-091d-4f96-8300-981cb9ae60b1	mia_house_212	{"bedrooms": 5, "bathrooms": 4, "sqft": 3800, "type": "House", "description": "Elegant home overlooking Coral Gables golf course with Spanish-style architecture."}	mateo.ramirez@email.com	\N	\N	5831	Commercial Drive	Apt 5	Burnaby	British Columbia	V5C7 5X9	Canada	49.24024468	-122.97983553	5831 Commercial Drive, Apt 5, Burnaby, British Columbia, V5C7 5X9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'5':5 '5831':1 '5x9':10 'apt':4 'british':7 'burnabi':6 'columbia':8 'commerci':2 'drive':3 'v5c7':9
73	Fisher Island Exclusive	2800000	https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800	2025-03-03 23:03:34.188523	\N	f	9ec5162b-8ed4-417d-8258-753153509fdf	mia_condo_213	{"bedrooms": 3, "bathrooms": 3, "sqft": 2200, "type": "Condo", "description": "Exclusive condo on private Fisher Island with golf course and marina access."}	camila.torres@email.com	\N	\N	2199	Maple Drive	Unit 24	Burnaby	British Columbia	V7T7 5B4	Canada	49.24113865	-122.99089155	2199 Maple Drive, Unit 24, Burnaby, British Columbia, V7T7 5B4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2199':1 '24':5 '5b4':10 'british':7 'burnabi':6 'columbia':8 'drive':3 'mapl':2 'unit':4 'v7t7':9
74	Doral Modern Contemporary	850000	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	2025-02-28 23:03:34.188523	\N	f	ddee607b-952f-47a9-abfd-4307b498d7fa	mia_house_214	{"bedrooms": 4, "bathrooms": 3, "sqft": 2500, "type": "House", "description": "Contemporary home in Doral with open floor plan and resort-style backyard."}	santiago.jimenez@email.com	\N	\N	9580	Hemlock Street	Apt 5	Vancouver	British Columbia	V4A4 3L6	Canada	49.29824011	-123.15057546	9580 Hemlock Street, Apt 5, Vancouver, British Columbia, V4A4 3L6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'3l6':10 '5':5 '9580':1 'apt':4 'british':7 'columbia':8 'hemlock':2 'street':3 'v4a4':9 'vancouv':6
75	Edgewater Bayfront Views	950000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2025-02-25 23:03:34.188523	\N	f	4bf57051-57ae-4cfb-b826-174172b5c495	mia_condo_215	{"bedrooms": 2, "bathrooms": 2, "sqft": 1300, "type": "Condo", "description": "Modern condo in Edgewater with stunning bayfront views and urban convenience."}	lucia.perez@email.com	\N	\N	8053	Cedar Lane	Apt 2	Vancouver	British Columbia	V5E9 7E4	Canada	49.29294034	-123.09098406	8053 Cedar Lane, Apt 2, Vancouver, British Columbia, V5E9 7E4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2':5 '7e4':10 '8053':1 'apt':4 'british':7 'cedar':2 'columbia':8 'lane':3 'v5e9':9 'vancouv':6
76	Homestead Ranch Style	450000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2025-02-22 23:03:34.188523	\N	f	ab5a781d-e8e6-437e-ab80-b5d7d8c350d7	mia_house_216	{"bedrooms": 3, "bathrooms": 2, "sqft": 2000, "type": "House", "description": "Spacious ranch-style home in Homestead with large lot and country feel."}	andres.ruiz@email.com	\N	\N	2357	Davie Street	Unit 47	Vancouver	British Columbia	V5C8 5K3	Canada	49.32200620	-123.15354884	2357 Davie Street, Unit 47, Vancouver, British Columbia, V5C8 5K3, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2357':1 '47':5 '5k3':10 'british':7 'columbia':8 'davi':2 'street':3 'unit':4 'v5c8':9 'vancouv':6
77	Midtown Miami Urban Loft	650000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2025-02-19 23:03:34.188523	\N	f	7dcc2846-5901-4705-9cba-301f1f1783f2	mia_condo_217	{"bedrooms": 1, "bathrooms": 1, "sqft": 800, "type": "Loft", "description": "Trendy loft in vibrant Midtown Miami with easy access to Design District."}	sofia.delgado@email.com	\N	\N	5304	Granville Street	\N	Richmond	British Columbia	V5N7 6R7	Canada	49.18874321	-123.14407842	5304 Granville Street, Richmond, British Columbia, V5N7 6R7, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'5304':1 '6r7':8 'british':5 'columbia':6 'granvill':2 'richmond':4 'street':3 'v5n7':7
78	Miami Shores Waterfront	1850000	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800	2025-02-16 23:03:34.188523	\N	f	c9f138e3-0329-42d2-9097-0361b1fe77dc	mia_house_218	{"bedrooms": 4, "bathrooms": 3, "sqft": 2600, "type": "House", "description": "Waterfront home in Miami Shores with boat dock and Intracoastal access."}	elena.cruz@email.com	\N	\N	2637	Pine Road	\N	Coquitlam	British Columbia	V4G7 6C3	Canada	49.29232256	-122.80321794	2637 Pine Road, Coquitlam, British Columbia, V4G7 6C3, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2637':1 '6c3':8 'british':5 'columbia':6 'coquitlam':4 'pine':2 'road':3 'v4g7':7
79	Dadeland Business District	550000	https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800	2025-02-13 23:03:34.188523	\N	f	981b7a49-49de-429d-907a-f97175d0626a	mia_condo_219	{"bedrooms": 2, "bathrooms": 2, "sqft": 1100, "type": "Condo", "description": "Convenient condo near Dadeland Mall and business district with modern amenities."}	manuel.santos@email.com	\N	\N	690	Cambie Street	Unit 42	New Westminster	British Columbia	V6Z1 2E1	Canada	49.20719858	-122.91448966	690 Cambie Street, Unit 42, New Westminster, British Columbia, V6Z1 2E1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2e1':11 '42':5 '690':1 'british':8 'cambi':2 'columbia':9 'new':6 'street':3 'unit':4 'v6z1':10 'westminst':7
80	Palmetto Bay Family Home	750000	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800	2025-02-10 23:03:34.188523	\N	f	0b5a2a2a-736c-40d2-84e8-0fdaf6b4973f	mia_house_220	{"bedrooms": 4, "bathrooms": 3, "sqft": 2400, "type": "House", "description": "Family-friendly home in Palmetto Bay with pool and excellent school district."}	rafael.moreno@email.com	\N	\N	7585	Commercial Drive	\N	West Vancouver	British Columbia	V6P6 6E9	Canada	49.33409750	-123.17023233	7585 Commercial Drive, West Vancouver, British Columbia, V6P6 6E9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'6e9':9 '7585':1 'british':6 'columbia':7 'commerci':2 'drive':3 'v6p6':8 'vancouv':5 'west':4
81	Sunny Isles Beach Resort Living	1250000	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800	2025-02-07 23:03:34.188523	\N	f	5c1357ed-0a3c-4b90-8bd9-84adbe1a02bb	mia_condo_221	{"bedrooms": 2, "bathrooms": 2, "sqft": 1200, "type": "Condo", "description": "Resort-style living in Sunny Isles Beach with ocean access and luxury amenities."}	gloria.martinez@email.com	\N	\N	5981	Hemlock Street	\N	West Vancouver	British Columbia	V6T5 4G1	Canada	49.33033837	-123.15638299	5981 Hemlock Street, West Vancouver, British Columbia, V6T5 4G1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4g1':9 '5981':1 'british':6 'columbia':7 'hemlock':2 'street':3 'v6t5':8 'vancouv':5 'west':4
82	Kendall Suburban Comfort	520000	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	2025-02-04 23:03:34.188523	\N	f	1b828bee-c169-454a-bc8e-d91c6652665c	mia_house_222	{"bedrooms": 3, "bathrooms": 2, "sqft": 1800, "type": "House", "description": "Comfortable suburban home in Kendall with large backyard and family-friendly neighborhood."}	adriana.flores@email.com	\N	\N	3521	Birch Avenue	\N	Burnaby	British Columbia	V6X0 9Y2	Canada	49.25433495	-122.96152172	3521 Birch Avenue, Burnaby, British Columbia, V6X0 9Y2, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'3521':1 '9y2':8 'avenu':3 'birch':2 'british':5 'burnabi':4 'columbia':6 'v6x0':7
83	Biscayne Bay Downtown	850000	https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800	2025-02-01 23:03:34.188523	\N	f	16e7948e-ad57-4dc0-a5f4-2a8047ae9579	mia_condo_223	{"bedrooms": 1, "bathrooms": 1, "sqft": 950, "type": "Condo", "description": "Downtown condo with Biscayne Bay views and walking distance to cultural attractions."}	fernando.silva@email.com	\N	\N	6947	Cedar Lane	\N	Surrey	British Columbia	V6B1 4B7	Canada	49.19928077	-122.86622906	6947 Cedar Lane, Surrey, British Columbia, V6B1 4B7, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4b7':8 '6947':1 'british':5 'cedar':2 'columbia':6 'lane':3 'surrey':4 'v6b1':7
84	Westchester Traditional	480000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2025-01-29 23:03:34.188523	\N	f	135cda02-e404-4d2c-bc38-3170b66289ca	mia_house_224	{"bedrooms": 3, "bathrooms": 2, "sqft": 1600, "type": "House", "description": "Traditional home in established Westchester neighborhood with mature landscaping."}	cecilia.romero@email.com	\N	\N	5416	Maple Drive	Unit 21	New Westminster	British Columbia	V3L0 8E1	Canada	49.19635386	-122.90070119	5416 Maple Drive, Unit 21, New Westminster, British Columbia, V3L0 8E1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'21':5 '5416':1 '8e1':11 'british':8 'columbia':9 'drive':3 'mapl':2 'new':6 'unit':4 'v3l0':10 'westminst':7
85	Little Havana Culture District	350000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2025-01-26 23:03:34.188523	\N	f	79366392-a657-455d-8aa6-1846a016a6c5	mia_condo_225	{"bedrooms": 1, "bathrooms": 1, "sqft": 700, "type": "Condo", "description": "Authentic condo in vibrant Little Havana with rich cultural atmosphere."}	miguel.guerrero@email.com	\N	\N	9301	Davie Street	Unit 16	Coquitlam	British Columbia	V7R9 1M0	Canada	49.28438300	-122.78166907	9301 Davie Street, Unit 16, Coquitlam, British Columbia, V7R9 1M0, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'16':5 '1m0':10 '9301':1 'british':7 'columbia':8 'coquitlam':6 'davi':2 'street':3 'unit':4 'v7r9':9
86	Hialeah Family Neighborhood	420000	https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800	2025-01-23 23:03:34.188523	\N	f	71dafe2c-e2a9-4350-8b49-b2558295c8b3	mia_house_226	{"bedrooms": 3, "bathrooms": 2, "sqft": 1500, "type": "House", "description": "Well-maintained family home in Hialeah with fenced yard and covered patio."}	carmen.vega@email.com	\N	\N	9481	Hemlock Street	Unit 28	Coquitlam	British Columbia	V7E7 7Z5	Canada	49.29461464	-122.78200797	9481 Hemlock Street, Unit 28, Coquitlam, British Columbia, V7E7 7Z5, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'28':5 '7z5':10 '9481':1 'british':7 'columbia':8 'coquitlam':6 'hemlock':2 'street':3 'unit':4 'v7e7':9
87	Aventura Shopping Paradise	950000	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800	2025-01-20 23:03:34.188523	\N	f	f97eef0f-4e06-45bf-bbb4-ca3c009ec52d	mia_condo_227	{"bedrooms": 2, "bathrooms": 2, "sqft": 1250, "type": "Condo", "description": "Luxury condo near Aventura Mall with golf course access and resort amenities."}	rodrigo.mendez@email.com	\N	\N	8976	Maple Drive	Unit 29	New Westminster	British Columbia	V3N5 5M6	Canada	49.19398627	-122.91548778	8976 Maple Drive, Unit 29, New Westminster, British Columbia, V3N5 5M6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'29':5 '5m6':11 '8976':1 'british':8 'columbia':9 'drive':3 'mapl':2 'new':6 'unit':4 'v3n5':10 'westminst':7
88	Cutler Bay Waterfront Community	650000	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800	2025-01-17 23:03:34.188523	\N	f	34464b7c-792e-4bb4-b67e-6f7f223e3781	mia_house_228	{"bedrooms": 3, "bathrooms": 2, "sqft": 1900, "type": "House", "description": "Modern home in waterfront Cutler Bay community with marina and recreational facilities."}	daniela.aguilar@email.com	\N	\N	6416	Birch Avenue	\N	Vancouver	British Columbia	V6W2 9N4	Canada	49.30236477	-123.12665626	6416 Birch Avenue, Vancouver, British Columbia, V6W2 9N4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'6416':1 '9n4':8 'avenu':3 'birch':2 'british':5 'columbia':6 'v6w2':7 'vancouv':4
89	Hallandale Beach High-Rise	750000	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	2025-01-14 23:03:34.188523	\N	f	2244d6cd-11e7-48f9-8ed1-b4a2f07385f9	mia_condo_229	{"bedrooms": 2, "bathrooms": 2, "sqft": 1100, "type": "Condo", "description": "Beachfront high-rise condo in Hallandale with direct ocean access and modern amenities."}	patricia.lara@email.com	\N	\N	336	Cherry Street	\N	New Westminster	British Columbia	V5T8 5V9	Canada	49.22044813	-122.92204160	336 Cherry Street, New Westminster, British Columbia, V5T8 5V9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'336':1 '5v9':9 'british':6 'cherri':2 'columbia':7 'new':4 'street':3 'v5t8':8 'westminst':5
90	Perrine Country Living	380000	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800	2025-01-11 23:03:34.188523	\N	f	f64c11e9-4d8d-4b89-97ed-9b57d12676d6	mia_house_230	{"bedrooms": 3, "bathrooms": 2, "sqft": 1700, "type": "House", "description": "Country-style home in Perrine with large lot and peaceful rural atmosphere."}	jesus.varela@email.com	\N	\N	1444	Pine Road	\N	Vancouver	British Columbia	V3E7 6L2	Canada	49.31348111	-123.13317636	1444 Pine Road, Vancouver, British Columbia, V3E7 6L2, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1444':1 '6l2':8 'british':5 'columbia':6 'pine':2 'road':3 'v3e7':7 'vancouv':4
91	Pembroke Pines Family Community	450000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2025-01-08 23:03:34.188523	\N	f	e792733f-7100-4d10-ad64-69f392071361	mia_condo_231	{"bedrooms": 2, "bathrooms": 2, "sqft": 1200, "type": "Condo", "description": "Family-oriented condo in Pembroke Pines with community pool and playground."}	esperanza.soto@email.com	\N	\N	4253	Commercial Drive	\N	North Vancouver	British Columbia	V3L2 4Y9	Canada	49.31339648	-123.09063896	4253 Commercial Drive, North Vancouver, British Columbia, V3L2 4Y9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4253':1 '4y9':9 'british':6 'columbia':7 'commerci':2 'drive':3 'north':4 'v3l2':8 'vancouv':5
92	North Miami Beach Cottage	550000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2025-01-05 23:03:34.188523	\N	f	0cd2b8e5-eb73-41b1-8f99-7617802c6c72	mia_house_232	{"bedrooms": 2, "bathrooms": 2, "sqft": 1300, "type": "House", "description": "Charming beach cottage in North Miami Beach with updated kitchen and tropical landscaping."}	lorenzo.campos@email.com	\N	\N	2669	Oak Avenue	Unit 45	Coquitlam	British Columbia	V7Z6 2R6	Canada	49.29337316	-122.79799714	2669 Oak Avenue, Unit 45, Coquitlam, British Columbia, V7Z6 2R6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2669':1 '2r6':10 '45':5 'avenu':3 'british':7 'columbia':8 'coquitlam':6 'oak':2 'unit':4 'v7z6':9
93	Hollywood Beach Boardwalk	650000	https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800	2025-01-02 23:03:34.188523	\N	f	86bf2a5b-e168-477d-8a82-489407462cab	mia_condo_233	{"bedrooms": 1, "bathrooms": 1, "sqft": 800, "type": "Condo", "description": "Beachfront condo on Hollywood Boardwalk with ocean views and beach lifestyle."}	beatriz.molina@email.com	\N	\N	4672	Fir Avenue	\N	Vancouver	British Columbia	V7W5 3N9	Canada	49.24733447	-123.10644001	4672 Fir Avenue, Vancouver, British Columbia, V7W5 3N9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'3n9':8 '4672':1 'avenu':3 'british':5 'columbia':6 'fir':2 'v7w5':7 'vancouv':4
94	Sweetwater Family Sanctuary	390000	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800	2024-12-30 23:03:34.188523	\N	f	10baa852-2d8e-4d0f-9622-e4065b81f0f4	mia_house_234	{"bedrooms": 3, "bathrooms": 2, "sqft": 1600, "type": "House", "description": "Peaceful family home in Sweetwater with fenced yard and quiet neighborhood setting."}	gustavo.navarro@email.com	\N	\N	9048	Cherry Street	\N	New Westminster	British Columbia	V5Z8 8H4	Canada	49.19841961	-122.91860124	9048 Cherry Street, New Westminster, British Columbia, V5Z8 8H4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'8h4':9 '9048':1 'british':6 'cherri':2 'columbia':7 'new':4 'street':3 'v5z8':8 'westminst':5
95	Miami Lakes Golf Community	520000	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800	2024-12-27 23:03:34.188523	\N	f	d01977e5-f725-4997-b8ab-0468f20b2297	mia_condo_235	{"bedrooms": 2, "bathrooms": 2, "sqft": 1150, "type": "Condo", "description": "Golf community condo in Miami Lakes with course access and resort-style amenities."}	veronica.herrera@email.com	\N	\N	2477	Birch Avenue	Unit 30	North Vancouver	British Columbia	V6J1 4B2	Canada	49.32066707	-123.10607157	2477 Birch Avenue, Unit 30, North Vancouver, British Columbia, V6J1 4B2, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2477':1 '30':5 '4b2':11 'avenu':3 'birch':2 'british':8 'columbia':9 'north':6 'unit':4 'v6j1':10 'vancouv':7
96	Westchester Classic Ranch	470000	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	2024-12-24 23:03:34.188523	\N	f	6d4248a8-1e1a-408d-8530-7ca5d7c0b030	mia_house_236	{"bedrooms": 3, "bathrooms": 2, "sqft": 1750, "type": "House", "description": "Classic ranch home in Westchester with updated interiors and mature fruit trees."}	alejandro.cortez@email.com	\N	\N	9965	Fraser Street	\N	New Westminster	British Columbia	V6E9 6M8	Canada	49.19609336	-122.92055864	9965 Fraser Street, New Westminster, British Columbia, V6E9 6M8, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'6m8':9 '9965':1 'british':6 'columbia':7 'fraser':2 'new':4 'street':3 'v6e9':8 'westminst':5
97	Bay Harbor Islands Waterfront	1850000	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800	2024-12-21 23:03:34.188523	\N	f	f2bfbf4b-eae2-4c0e-abd7-7213ca4e23d1	mia_condo_237	{"bedrooms": 3, "bathrooms": 3, "sqft": 1800, "type": "Condo", "description": "Exclusive waterfront condo in Bay Harbor Islands with boat slips and island living."}	monica.restrepo@email.com	\N	\N	300	Commercial Drive	Unit 12	Coquitlam	British Columbia	V3N9 7N4	Canada	49.29811582	-122.78232188	300 Commercial Drive, Unit 12, Coquitlam, British Columbia, V3N9 7N4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'12':5 '300':1 '7n4':10 'british':7 'columbia':8 'commerci':2 'coquitlam':6 'drive':3 'unit':4 'v3n9':9
98	Fontainebleau Affordable Living	320000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2024-12-18 23:03:34.188523	\N	f	3d2c3f95-2c08-4d03-8388-6a469d0d9cf3	mia_house_238	{"bedrooms": 2, "bathrooms": 2, "sqft": 1200, "type": "House", "description": "Affordable home in Fontainebleau neighborhood with community amenities and central location."}	hector.morales@email.com	\N	\N	6431	Oak Avenue	Unit 50	Richmond	British Columbia	V5T2 7S6	Canada	49.16197941	-123.13011654	6431 Oak Avenue, Unit 50, Richmond, British Columbia, V5T2 7S6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'50':5 '6431':1 '7s6':10 'avenu':3 'british':7 'columbia':8 'oak':2 'richmond':6 'unit':4 'v5t2':9
99	Aventura Waterways	1150000	https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800	2024-12-15 23:03:34.188523	\N	f	03a7bdd7-0d50-4cfc-ab81-6e6af032d419	mia_condo_239	{"bedrooms": 2, "bathrooms": 2, "sqft": 1400, "type": "Condo", "description": "Luxurious condo in Aventura waterways with marina access and upscale amenities."}	claudia.rivera@email.com	\N	\N	508	Birch Avenue	Apt 20	West Vancouver	British Columbia	V6A4 4K8	Canada	49.32953503	-123.15270481	508 Birch Avenue, Apt 20, West Vancouver, British Columbia, V6A4 4K8, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'20':5 '4k8':11 '508':1 'apt':4 'avenu':3 'birch':2 'british':8 'columbia':9 'v6a4':10 'vancouv':7 'west':6
100	Richmond Heights Traditional	410000	https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800	2024-12-12 23:03:34.188523	\N	f	6f034f50-252e-4d79-9ee4-c4d594d36688	mia_house_240	{"bedrooms": 3, "bathrooms": 2, "sqft": 1550, "type": "House", "description": "Traditional family home in Richmond Heights with covered patio and established neighborhood."}	rosario.castro@email.com	\N	\N	1757	Fir Avenue	Unit 10	Vancouver	British Columbia	V7T1 8R9	Canada	49.25129378	-123.10424007	1757 Fir Avenue, Unit 10, Vancouver, British Columbia, V7T1 8R9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'10':5 '1757':1 '8r9':10 'avenu':3 'british':7 'columbia':8 'fir':2 'unit':4 'v7t1':9 'vancouv':6
101	Lincoln Park Victorian Conversion	1450000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2024-12-09 23:03:42.696198	\N	f	52e450a8-fddc-489c-affe-edee66d974c6	chi_apt_241	{"bedrooms": 3, "bathrooms": 3, "sqft": 2000, "type": "Condo", "description": "Beautiful Victorian conversion in Lincoln Park with original details and modern amenities."}	thomas.kowalski@email.com	\N	\N	141	Denman Street	Apt 6	New Westminster	British Columbia	V6A1 9R1	Canada	49.20041428	-122.90256725	141 Denman Street, Apt 6, New Westminster, British Columbia, V6A1 9R1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'141':1 '6':5 '9r1':11 'apt':4 'british':8 'columbia':9 'denman':2 'new':6 'street':3 'v6a1':10 'westminst':7
115	Pilsen Mexican Culture District	420000	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800	2024-10-28 23:03:42.696198	\N	f	d0f89f82-3e12-424b-91a5-84e88f6b9ff0	chi_house_254	{"bedrooms": 3, "bathrooms": 2, "sqft": 1600, "type": "House", "description": "Colorful home in vibrant Pilsen with Mexican murals and cultural richness."}	grzegorz.kowalczyk@email.com	\N	\N	2117	Elm Street	\N	Vancouver	British Columbia	V5Z0 1E4	Canada	49.30129632	-123.10269823	2117 Elm Street, Vancouver, British Columbia, V5Z0 1E4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1e4':8 '2117':1 'british':5 'columbia':6 'elm':2 'street':3 'v5z0':7 'vancouv':4
116	Fulton Market Meatpacking District	1450000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2024-10-25 23:03:42.696198	\N	f	e3d4b5d7-104e-4a13-84e6-ddc95023d3b6	chi_loft_255	{"bedrooms": 2, "bathrooms": 2, "sqft": 1800, "type": "Loft", "description": "Industrial loft in trendy Fulton Market with restaurants and nightlife nearby."}	elzbieta.wozniak@email.com	\N	\N	6668	Cambie Street	\N	Vancouver	British Columbia	V6H6 6E1	Canada	49.30985337	-123.13645553	6668 Cambie Street, Vancouver, British Columbia, V6H6 6E1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'6668':1 '6e1':8 'british':5 'cambi':2 'columbia':6 'street':3 'v6h6':7 'vancouv':4
117	Ukrainian Village Historic	650000	https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800	2024-10-22 23:03:42.696198	\N	f	53b1f19a-fd1e-476b-8f22-029a82901897	chi_condo_256	{"bedrooms": 2, "bathrooms": 2, "sqft": 1300, "type": "Condo", "description": "Historic condo in Ukrainian Village with Eastern European heritage and character."}	marek.kozlowski@email.com	\N	\N	6761	Robson Street	\N	Burnaby	British Columbia	V5S7 4R4	Canada	49.23744355	-122.99659316	6761 Robson Street, Burnaby, British Columbia, V5S7 4R4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4r4':8 '6761':1 'british':5 'burnabi':4 'columbia':6 'robson':2 'street':3 'v5s7':7
118	Roscoe Village Family Friendly	850000	https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800	2024-10-19 23:03:42.696198	\N	f	f9f2deb7-36b6-4bd1-87f9-8ba74e7c2aa4	chi_house_257	{"bedrooms": 4, "bathrooms": 3, "sqft": 2000, "type": "House", "description": "Family home in quiet Roscoe Village with good schools and community parks."}	dorota.malinowska@email.com	\N	\N	6382	Hemlock Street	\N	Vancouver	British Columbia	V5A6 4H2	Canada	49.27349199	-123.14886696	6382 Hemlock Street, Vancouver, British Columbia, V5A6 4H2, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4h2':8 '6382':1 'british':5 'columbia':6 'hemlock':2 'street':3 'v5a6':7 'vancouv':4
119	Humboldt Park Puerto Rican	380000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2024-10-16 23:03:42.696198	\N	f	6bb012e8-ef61-465e-a29a-55b37d3bc1a2	chi_apt_258	{"bedrooms": 2, "bathrooms": 1, "sqft": 1100, "type": "Apartment", "description": "Affordable apartment in Humboldt Park with Puerto Rican culture and community."}	jakub.piotrowski@email.com	\N	\N	326	Main Street	Unit 46	West Vancouver	British Columbia	V7J0 5G7	Canada	49.31323059	-123.15542282	326 Main Street, Unit 46, West Vancouver, British Columbia, V7J0 5G7, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'326':1 '46':5 '5g7':11 'british':8 'columbia':9 'main':2 'street':3 'unit':4 'v7j0':10 'vancouv':7 'west':6
120	North Center Vintage Charm	750000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2024-10-13 23:03:42.696198	\N	f	6106d0f9-dd06-4ceb-8dfd-8911790a7821	chi_condo_259	{"bedrooms": 3, "bathrooms": 2, "sqft": 1500, "type": "Condo", "description": "Vintage condo in North Center with original details and modern updates."}	iwona.grabowska@email.com	\N	\N	6887	Denman Street	\N	West Vancouver	British Columbia	V5W1 7S6	Canada	49.33927200	-123.16423869	6887 Denman Street, West Vancouver, British Columbia, V5W1 7S6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'6887':1 '7s6':9 'british':6 'columbia':7 'denman':2 'street':3 'v5w1':8 'vancouv':5 'west':4
121	Bridgeport Working Class	320000	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	2024-10-10 23:03:42.696198	\N	f	cc27839e-77a7-4111-9102-232867e7b318	chi_house_260	{"bedrooms": 2, "bathrooms": 2, "sqft": 1200, "type": "House", "description": "Traditional working-class home in historic Bridgeport neighborhood."}	ryszard.nowicki@email.com	\N	\N	1368	Fraser Street	Unit 1	Richmond	British Columbia	V7Y7 4R4	Canada	49.14747933	-123.14099756	1368 Fraser Street, Unit 1, Richmond, British Columbia, V7Y7 4R4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1':5 '1368':1 '4r4':10 'british':7 'columbia':8 'fraser':2 'richmond':6 'street':3 'unit':4 'v7y7':9
122	Noble Square Artist Loft	550000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2024-10-07 23:03:42.696198	\N	f	2f4d015d-f44b-4604-9592-c7f5a4a2c930	chi_loft_261	{"bedrooms": 1, "bathrooms": 2, "sqft": 1200, "type": "Loft", "description": "Artist loft in Noble Square with high ceilings and creative community."}	halina.zyskowska@email.com	\N	\N	1376	Maple Drive	Unit 37	New Westminster	British Columbia	V5H0 3A1	Canada	49.21446123	-122.89943639	1376 Maple Drive, Unit 37, New Westminster, British Columbia, V5H0 3A1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1376':1 '37':5 '3a1':11 'british':8 'columbia':9 'drive':3 'mapl':2 'new':6 'unit':4 'v5h0':10 'westminst':7
123	Uptown Multicultural	420000	https://images.unsplash.com/photo-1600607688066-890987cd4af7?w=800	2024-10-04 23:03:42.696198	\N	f	596c1254-d476-4e18-94d4-be4a89de67dc	chi_condo_262	{"bedrooms": 1, "bathrooms": 1, "sqft": 800, "type": "Condo", "description": "Diverse condo in multicultural Uptown with entertainment and dining options."}	wladyslaw.kwiatkowski@email.com	\N	\N	8866	Maple Drive	\N	Vancouver	British Columbia	V6P6 2N6	Canada	49.30098068	-123.11527380	8866 Maple Drive, Vancouver, British Columbia, V6P6 2N6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2n6':8 '8866':1 'british':5 'columbia':6 'drive':3 'mapl':2 'v6p6':7 'vancouv':4
124	Albany Park Immigrant Community	450000	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800	2024-10-01 23:03:42.696198	\N	f	70c21488-fb75-474b-a0b3-2439d327d908	chi_house_263	{"bedrooms": 3, "bathrooms": 2, "sqft": 1400, "type": "House", "description": "Welcoming home in diverse Albany Park with strong immigrant community."}	jadwiga.sikora@email.com	\N	\N	8311	Elm Street	Apt 10	Vancouver	British Columbia	V7W3 9B7	Canada	49.30486992	-123.16969700	8311 Elm Street, Apt 10, Vancouver, British Columbia, V7W3 9B7, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'10':5 '8311':1 '9b7':10 'apt':4 'british':7 'columbia':8 'elm':2 'street':3 'v7w3':9 'vancouv':6
125	Rogers Park Lakefront	350000	https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800	2024-09-28 23:03:42.696198	\N	f	8edde880-be66-4d18-b6c5-b15095c39260	chi_apt_264	{"bedrooms": 1, "bathrooms": 1, "sqft": 700, "type": "Apartment", "description": "Affordable lakefront apartment in Rogers Park with beach access."}	tadeusz.ostrowski@email.com	\N	\N	1794	Maple Drive	Unit 44	Burnaby	British Columbia	V4Y5 6W9	Canada	49.23105857	-122.97177787	1794 Maple Drive, Unit 44, Burnaby, British Columbia, V4Y5 6W9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1794':1 '44':5 '6w9':10 'british':7 'burnabi':6 'columbia':8 'drive':3 'mapl':2 'unit':4 'v4y5':9
126	Edgewater Beach Community	480000	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800	2024-09-25 23:03:42.696198	\N	f	d08eef75-f41d-486f-bc65-dba46996b99a	chi_condo_265	{"bedrooms": 2, "bathrooms": 1, "sqft": 1000, "type": "Condo", "description": "Beach community condo in Edgewater with lakefront lifestyle and affordability."}	danuta.witkowska@email.com	\N	\N	8191	Robson Street	Apt 9	Surrey	British Columbia	V6R1 6Y3	Canada	49.17923274	-122.83897337	8191 Robson Street, Apt 9, Surrey, British Columbia, V6R1 6Y3, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'6y3':10 '8191':1 '9':5 'apt':4 'british':7 'columbia':8 'robson':2 'street':3 'surrey':6 'v6r1':9
127	Beverly Hills Chicago Elite	1250000	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800	2024-09-22 23:03:42.696198	\N	f	9d34ee1e-4e1d-4832-83f9-b627759a2783	chi_house_266	{"bedrooms": 4, "bathrooms": 4, "sqft": 2800, "type": "House", "description": "Elite home in Beverly Hills Chicago with mansion-like features and prestige."}	zenon.kaczmarek@email.com	\N	\N	3439	Pine Road	\N	Burnaby	British Columbia	V4P0 9R8	Canada	49.24236006	-122.99572365	3439 Pine Road, Burnaby, British Columbia, V4P0 9R8, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'3439':1 '9r8':8 'british':5 'burnabi':4 'columbia':6 'pine':2 'road':3 'v4p0':7
128	Chinatown Cultural District	380000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2024-09-19 23:03:42.696198	\N	f	8faa0ec2-a516-449d-a6e3-9f4eda793004	chi_apt_267	{"bedrooms": 2, "bathrooms": 1, "sqft": 900, "type": "Apartment", "description": "Cultural apartment in authentic Chinatown with traditional architecture and community."}	bronislawa.kowalska@email.com	\N	\N	2751	Cedar Lane	Unit 14	Coquitlam	British Columbia	V3Z1 4X6	Canada	49.26925923	-122.80395245	2751 Cedar Lane, Unit 14, Coquitlam, British Columbia, V3Z1 4X6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'14':5 '2751':1 '4x6':10 'british':7 'cedar':2 'columbia':8 'coquitlam':6 'lane':3 'unit':4 'v3z1':9
129	Little Italy Heritage	520000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2024-09-16 23:03:42.696198	\N	f	0bd75856-83d2-4018-9273-215cb8920a87	chi_condo_268	{"bedrooms": 2, "bathrooms": 2, "sqft": 1100, "type": "Condo", "description": "Italian heritage condo in Little Italy with traditional restaurants and culture."}	czeslaw.sadowski@email.com	\N	\N	730	Maple Drive	\N	Coquitlam	British Columbia	V6Y0 4B7	Canada	49.28098967	-122.80553454	730 Maple Drive, Coquitlam, British Columbia, V6Y0 4B7, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4b7':8 '730':1 'british':5 'columbia':6 'coquitlam':4 'drive':3 'mapl':2 'v6y0':7
130	Garfield Park Community	250000	https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800	2024-09-13 23:03:42.696198	\N	f	8013c997-c087-4e47-a7cb-cddd47813898	chi_house_269	{"bedrooms": 3, "bathrooms": 2, "sqft": 1300, "type": "House", "description": "Community-focused home in Garfield Park with local investment and improvement."}	eugeniusz.mazur@email.com	\N	\N	8296	Hemlock Street	Unit 50	Vancouver	British Columbia	V5Y9 2T2	Canada	49.31972654	-123.12273290	8296 Hemlock Street, Unit 50, Vancouver, British Columbia, V5Y9 2T2, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2t2':10 '50':5 '8296':1 'british':7 'columbia':8 'hemlock':2 'street':3 'unit':4 'v5y9':9 'vancouv':6
131	Near West Side Development	650000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2024-09-10 23:03:42.696198	\N	f	57977aa4-cf29-44c7-baad-54ba494b8288	chi_loft_270	{"bedrooms": 2, "bathrooms": 2, "sqft": 1300, "type": "Loft", "description": "Development area loft in Near West Side with urban renewal and investment potential."}	boleslaw.gorski@email.com	\N	\N	139	Hemlock Street	\N	West Vancouver	British Columbia	V3G2 3L1	Canada	49.31506989	-123.14868953	139 Hemlock Street, West Vancouver, British Columbia, V3G2 3L1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'139':1 '3l1':9 'british':6 'columbia':7 'hemlock':2 'street':3 'v3g2':8 'vancouv':5 'west':4
132	Near North Side Luxury	1950000	https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800	2024-09-07 23:03:42.696198	\N	f	51ed6722-74da-4bd7-8479-588abe920fb6	chi_condo_271	{"bedrooms": 3, "bathrooms": 3, "sqft": 1900, "type": "Condo", "description": "Luxury condo on Magnificent Mile with shopping and cultural attractions nearby."}	wieslaw.wroblewski@email.com	\N	\N	6900	Fir Avenue	\N	Burnaby	British Columbia	V6M0 3E7	Canada	49.25230293	-122.99333693	6900 Fir Avenue, Burnaby, British Columbia, V6M0 3E7, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'3e7':8 '6900':1 'avenu':3 'british':5 'burnabi':4 'columbia':6 'fir':2 'v6m0':7
133	Washington Park Historic	420000	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800	2024-09-04 23:03:42.696198	\N	f	61a37441-21f8-4e74-ad06-768c2222f93e	chi_house_272	{"bedrooms": 3, "bathrooms": 2, "sqft": 1500, "type": "House", "description": "Historic home in Washington Park with cultural significance and community pride."}	zygmunt.adamski@email.com	\N	\N	9235	Elm Street	\N	Coquitlam	British Columbia	V6T7 1W9	Canada	49.28577123	-122.80657038	9235 Elm Street, Coquitlam, British Columbia, V6T7 1W9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1w9':8 '9235':1 'british':5 'columbia':6 'coquitlam':4 'elm':2 'street':3 'v6t7':7
134	Grand Boulevard Heritage	320000	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	2024-09-01 23:03:42.696198	\N	f	e69f870d-2f58-49ea-926e-e815baaef3e0	chi_apt_273	{"bedrooms": 2, "bathrooms": 1, "sqft": 1000, "type": "Apartment", "description": "Heritage apartment in Grand Boulevard with historical architecture and character."}	mieczyslaw.urbanski@email.com	\N	\N	8501	Granville Street	Apt 10	Vancouver	British Columbia	V7N6 9L1	Canada	49.27166825	-123.09201535	8501 Granville Street, Apt 10, Vancouver, British Columbia, V7N6 9L1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'10':5 '8501':1 '9l1':10 'apt':4 'british':7 'columbia':8 'granvill':2 'street':3 'v7n6':9 'vancouv':6
135	Bronzeville Renaissance	480000	https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800	2024-08-29 23:03:42.696198	\N	f	17bbf1bb-a523-4348-b4ed-c0ffbe9577e8	chi_condo_274	{"bedrooms": 2, "bathrooms": 2, "sqft": 1200, "type": "Condo", "description": "Renaissance-era condo in historic Bronzeville with African-American heritage."}	witold.blaszczyk@email.com	\N	\N	8568	Oak Avenue	\N	West Vancouver	British Columbia	V3B7 2C1	Canada	49.31596905	-123.16218775	8568 Oak Avenue, West Vancouver, British Columbia, V3B7 2C1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2c1':9 '8568':1 'avenu':3 'british':6 'columbia':7 'oak':2 'v3b7':8 'vancouv':5 'west':4
136	Douglas Community Development	380000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2024-08-26 23:03:42.696198	\N	f	3b40ac13-a364-4e17-833e-1d06f7f1fa6a	chi_house_275	{"bedrooms": 3, "bathrooms": 2, "sqft": 1400, "type": "House", "description": "Community development home in Douglas with neighborhood investment and growth."}	lucjan.glowacki@email.com	\N	\N	8581	Robson Street	\N	West Vancouver	British Columbia	V7V5 5S1	Canada	49.31756843	-123.14471211	8581 Robson Street, West Vancouver, British Columbia, V7V5 5S1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'5s1':9 '8581':1 'british':6 'columbia':7 'robson':2 'street':3 'v7v5':8 'vancouv':5 'west':4
137	Printers Row Historic District	850000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2024-08-23 23:03:42.696198	\N	f	3719b1c2-a565-40d9-9100-8f1099a6638d	chi_loft_276	{"bedrooms": 2, "bathrooms": 2, "sqft": 1500, "type": "Loft", "description": "Historic Printers Row loft with vintage industrial character and downtown convenience."}	roman.jankowski@email.com	\N	\N	2928	Cherry Street	\N	Coquitlam	British Columbia	V5S0 2L7	Canada	49.27804583	-122.78135892	2928 Cherry Street, Coquitlam, British Columbia, V5S0 2L7, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2928':1 '2l7':8 'british':5 'cherri':2 'columbia':6 'coquitlam':4 'street':3 'v5s0':7
138	Museum Campus Views	750000	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800	2024-08-20 23:03:42.696198	\N	f	297290fa-fc49-44b4-a384-a3c318a33c1c	chi_condo_277	{"bedrooms": 2, "bathrooms": 2, "sqft": 1300, "type": "Condo", "description": "Condo near Museum Campus with cultural attractions and lakefront proximity."}	kazimierz.koziol@email.com	\N	\N	577	Birch Avenue	Unit 28	Vancouver	British Columbia	V6Y8 6A4	Canada	49.26420768	-123.12844910	577 Birch Avenue, Unit 28, Vancouver, British Columbia, V6Y8 6A4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'28':5 '577':1 '6a4':10 'avenu':3 'birch':2 'british':7 'columbia':8 'unit':4 'v6y8':9 'vancouv':6
139	Brighton Park Family	350000	https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800	2024-08-17 23:03:42.696198	\N	f	5cd4a7db-6b5f-4f64-b5c7-ae2fc5968845	chi_house_278	{"bedrooms": 3, "bathrooms": 2, "sqft": 1300, "type": "House", "description": "Family home in Brighton Park with strong community ties and affordable living."}	jerzy.stepien@email.com	\N	\N	7823	Fir Avenue	\N	West Vancouver	British Columbia	V5P4 9E5	Canada	49.32718944	-123.15642041	7823 Fir Avenue, West Vancouver, British Columbia, V5P4 9E5, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'7823':1 '9e5':9 'avenu':3 'british':6 'columbia':7 'fir':2 'v5p4':8 'vancouv':5 'west':4
140	Back of the Yards Working Class	280000	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800	2024-08-14 23:03:42.696198	\N	f	ed4463bd-810c-4e87-9824-4a418548a391	chi_apt_279	{"bedrooms": 2, "bathrooms": 1, "sqft": 1000, "type": "Apartment", "description": "Working-class apartment in Back of the Yards with industrial heritage."}	antoni.chmielewski@email.com	\N	\N	177	Granville Street	Apt 4	Vancouver	British Columbia	V5E2 4M4	Canada	49.31520970	-123.09141986	177 Granville Street, Apt 4, Vancouver, British Columbia, V5E2 4M4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'177':1 '4':5 '4m4':10 'apt':4 'british':7 'columbia':8 'granvill':2 'street':3 'v5e2':9 'vancouv':6
141	McKinley Park Green Space	420000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2024-08-11 23:03:42.696198	\N	f	e28baa6b-5a60-4e9f-99bb-6014bd8a71fa	chi_condo_280	{"bedrooms": 2, "bathrooms": 2, "sqft": 1100, "type": "Condo", "description": "Condo near McKinley Park with green space access and community atmosphere."}	franciszek.borkowski@email.com	\N	\N	8948	Birch Avenue	\N	Burnaby	British Columbia	V6L5 4R6	Canada	49.27098070	-122.98602541	8948 Birch Avenue, Burnaby, British Columbia, V6L5 4R6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4r6':8 '8948':1 'avenu':3 'birch':2 'british':5 'burnabi':4 'columbia':6 'v6l5':7
142	Back Bay Victorian Brownstone	2850000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2024-08-08 23:03:42.696198	\N	f	8b8ee96b-92d1-4da9-a72e-d7685366c991	bos_apt_281	{"bedrooms": 4, "bathrooms": 4, "sqft": 2800, "type": "Townhouse", "description": "Elegant Victorian brownstone in prestigious Back Bay with period details and modern amenities."}	patrick.sullivan@email.com	\N	\N	7208	Willow Way	\N	Surrey	British Columbia	V4K4 6K6	Canada	49.16709014	-122.83607577	7208 Willow Way, Surrey, British Columbia, V4K4 6K6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'6k6':8 '7208':1 'british':5 'columbia':6 'surrey':4 'v4k4':7 'way':3 'willow':2
143	North End Historic Condo	1450000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2024-08-05 23:03:42.696198	\N	f	909d0776-31b3-4700-8bb4-f17aeb779fbb	bos_condo_282	{"bedrooms": 2, "bathrooms": 2, "sqft": 1200, "type": "Condo", "description": "Historic condo in North End with Italian heritage and Freedom Trail proximity."}	mary.obrien@email.com	\N	\N	2404	Cherry Street	Unit 39	North Vancouver	British Columbia	V4W1 1N2	Canada	49.32518921	-123.08466523	2404 Cherry Street, Unit 39, North Vancouver, British Columbia, V4W1 1N2, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1n2':11 '2404':1 '39':5 'british':8 'cherri':2 'columbia':9 'north':6 'street':3 'unit':4 'v4w1':10 'vancouv':7
144	Cambridge Harvard Square	3200000	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800	2024-08-02 23:03:42.696198	\N	f	a926046b-9e04-4b21-8eeb-2537c6bd1427	bos_house_283	{"bedrooms": 5, "bathrooms": 4, "sqft": 3500, "type": "House", "description": "Distinguished home near Harvard Square with academic atmosphere and historic charm."}	james.fitzgerald@email.com	\N	\N	3608	Granville Street	Unit 25	Vancouver	British Columbia	V7C7 9S0	Canada	49.27159579	-123.09592709	3608 Granville Street, Unit 25, Vancouver, British Columbia, V7C7 9S0, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'25':5 '3608':1 '9s0':10 'british':7 'columbia':8 'granvill':2 'street':3 'unit':4 'v7c7':9 'vancouv':6
145	South End Warehouse Conversion	1850000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2024-07-30 23:03:42.696198	\N	f	c541b803-219b-4df4-9f5d-82871ee54f76	bos_loft_284	{"bedrooms": 2, "bathrooms": 2, "sqft": 1600, "type": "Loft", "description": "Stunning warehouse conversion in trendy South End with exposed brick and modern design."}	sarah.murphy@email.com	\N	\N	1898	Granville Street	Unit 13	Richmond	British Columbia	V5X8 2G9	Canada	49.16013086	-123.13530282	1898 Granville Street, Unit 13, Richmond, British Columbia, V5X8 2G9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'13':5 '1898':1 '2g9':10 'british':7 'columbia':8 'granvill':2 'richmond':6 'street':3 'unit':4 'v5x8':9
146	Beacon Hill Historic District	2200000	https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800	2024-07-27 23:03:42.696198	\N	f	f967ebb0-d922-4575-8028-13ebfa823383	bos_condo_285	{"bedrooms": 3, "bathrooms": 2, "sqft": 1500, "type": "Condo", "description": "Historic Beacon Hill condo with cobblestone streets and Federal-style architecture."}	michael.kelly@email.com	\N	\N	3654	Hemlock Street	Unit 32	North Vancouver	British Columbia	V7R4 4K5	Canada	49.32658026	-123.08103420	3654 Hemlock Street, Unit 32, North Vancouver, British Columbia, V7R4 4K5, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'32':5 '3654':1 '4k5':11 'british':8 'columbia':9 'hemlock':2 'north':6 'street':3 'unit':4 'v7r4':10 'vancouv':7
147	Somerville Porter Square	750000	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	2024-07-24 23:03:42.696198	\N	f	4dd84768-72c9-47d7-a92c-62b8f1b6e665	bos_apt_286	{"bedrooms": 2, "bathrooms": 1, "sqft": 1000, "type": "Apartment", "description": "Affordable apartment in diverse Somerville near Porter Square T station."}	jennifer.ryan@email.com	\N	\N	1519	Main Street	\N	Burnaby	British Columbia	V5E8 3E3	Canada	49.22838257	-122.99364934	1519 Main Street, Burnaby, British Columbia, V5E8 3E3, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1519':1 '3e3':8 'british':5 'burnabi':4 'columbia':6 'main':2 'street':3 'v5e8':7
148	Jamaica Plain Victorian	950000	https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800	2024-07-21 23:03:42.696198	\N	f	015ab906-d655-49d6-84b2-44df2b37a345	bos_house_287	{"bedrooms": 3, "bathrooms": 2, "sqft": 1800, "type": "House", "description": "Victorian home in eclectic Jamaica Plain with artist community and local culture."}	david.mccarthy@email.com	\N	\N	4173	Maple Drive	Unit 33	Coquitlam	British Columbia	V5G5 2R1	Canada	49.29452134	-122.78948785	4173 Maple Drive, Unit 33, Coquitlam, British Columbia, V5G5 2R1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2r1':10 '33':5 '4173':1 'british':7 'columbia':8 'coquitlam':6 'drive':3 'mapl':2 'unit':4 'v5g5':9
149	Seaport District Modern	1650000	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800	2024-07-18 23:03:42.696198	\N	f	aa7e77c2-7385-45af-9779-ea528d69fd3b	bos_condo_288	{"bedrooms": 2, "bathrooms": 2, "sqft": 1300, "type": "Condo", "description": "Ultra-modern condo in Seaport District with harbor views and contemporary amenities."}	lisa.connor@email.com	\N	\N	9662	Cherry Street	\N	Surrey	British Columbia	V3G2 6W1	Canada	49.20861516	-122.84697268	9662 Cherry Street, Surrey, British Columbia, V3G2 6W1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'6w1':8 '9662':1 'british':5 'cherri':2 'columbia':6 'street':3 'surrey':4 'v3g2':7
150	Brookline Coolidge Corner	1350000	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800	2024-07-15 23:03:42.696198	\N	f	30ba32c0-7f9f-495c-a9bc-fef5e1159a21	bos_house_289	{"bedrooms": 3, "bathrooms": 3, "sqft": 2000, "type": "House", "description": "Family home in desirable Brookline near Coolidge Corner with excellent schools."}	kevin.donovan@email.com	\N	\N	9515	Douglas Road	Unit 38	Surrey	British Columbia	V7R9 8N8	Canada	49.19781664	-122.85750546	9515 Douglas Road, Unit 38, Surrey, British Columbia, V7R9 8N8, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'38':5 '8n8':10 '9515':1 'british':7 'columbia':8 'dougla':2 'road':3 'surrey':6 'unit':4 'v7r9':9
151	Charlestown Navy Yard	1150000	https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800	2024-07-12 23:03:42.696198	\N	f	736b816f-341c-461d-9152-c3818abff071	bos_apt_290	{"bedrooms": 2, "bathrooms": 2, "sqft": 1100, "type": "Condo", "description": "Waterfront condo in historic Charlestown Navy Yard with harbor views."}	amanda.walsh@email.com	\N	\N	1205	Fraser Street	Apt 10	Vancouver	British Columbia	V3L7 4C9	Canada	49.28619942	-123.15129479	1205 Fraser Street, Apt 10, Vancouver, British Columbia, V3L7 4C9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'10':5 '1205':1 '4c9':10 'apt':4 'british':7 'columbia':8 'fraser':2 'street':3 'v3l7':9 'vancouv':6
152	Fort Point Channel Artist Loft	1250000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2024-07-09 23:03:42.696198	\N	f	0d822ea3-5676-4653-bdfe-28c2dec53226	bos_loft_291	{"bedrooms": 1, "bathrooms": 2, "sqft": 1400, "type": "Loft", "description": "Artist loft in Fort Point Channel with industrial character and creative community."}	daniel.brennan@email.com	\N	\N	7242	Elm Street	\N	Surrey	British Columbia	V5X9 1W3	Canada	49.21147841	-122.82421296	7242 Elm Street, Surrey, British Columbia, V5X9 1W3, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1w3':8 '7242':1 'british':5 'columbia':6 'elm':2 'street':3 'surrey':4 'v5x9':7
153	East Boston Waterfront	650000	https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800	2024-07-06 23:03:42.696198	\N	f	5aa49a12-05bd-40f4-acea-6eacf31e0c17	bos_condo_292	{"bedrooms": 2, "bathrooms": 1, "sqft": 1000, "type": "Condo", "description": "Affordable waterfront condo in East Boston with skyline views and airport convenience."}	rachel.flanagan@email.com	\N	\N	7372	Granville Street	\N	Vancouver	British Columbia	V5J2 6N7	Canada	49.25276954	-123.11792831	7372 Granville Street, Vancouver, British Columbia, V5J2 6N7, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'6n7':8 '7372':1 'british':5 'columbia':6 'granvill':2 'street':3 'v5j2':7 'vancouv':4
154	Newton Village Colonial	1850000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2024-07-05 23:03:42.696198	\N	f	24f8036f-562d-4273-996c-0a60ab1766bb	bos_house_293	{"bedrooms": 4, "bathrooms": 3, "sqft": 2500, "type": "House", "description": "Classic colonial home in Newton Village with suburban charm and top schools."}	brian.gallagher@email.com	\N	\N	3169	Main Street	\N	Vancouver	British Columbia	V4H0 3B9	Canada	49.30365153	-123.07904003	3169 Main Street, Vancouver, British Columbia, V4H0 3B9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'3169':1 '3b9':8 'british':5 'columbia':6 'main':2 'street':3 'v4h0':7 'vancouv':4
155	Allston College Area	420000	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800	2024-07-02 23:03:42.696198	\N	f	32f3d4cd-5b31-4128-9592-aa456af8cf13	bos_apt_294	{"bedrooms": 1, "bathrooms": 1, "sqft": 700, "type": "Apartment", "description": "Student-friendly apartment in Allston near Boston University and colleges."}	stephanie.mcgrath@email.com	\N	\N	1557	Oak Avenue	\N	Vancouver	British Columbia	V3B5 9X9	Canada	49.24428400	-123.12466921	1557 Oak Avenue, Vancouver, British Columbia, V3B5 9X9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1557':1 '9x9':8 'avenu':3 'british':5 'columbia':6 'oak':2 'v3b5':7 'vancouv':4
156	Dorchester Triple Decker	550000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2024-06-29 23:03:42.696198	\N	f	12366666-2215-4138-86e1-e2df1537a34f	bos_condo_295	{"bedrooms": 3, "bathrooms": 2, "sqft": 1400, "type": "Condo", "description": "Classic triple-decker condo in diverse Dorchester with affordable city living."}	christopher.oneill@email.com	\N	\N	2331	Spruce Road	Apt 11	Vancouver	British Columbia	V3J6 6W5	Canada	49.31939865	-123.15750426	2331 Spruce Road, Apt 11, Vancouver, British Columbia, V3J6 6W5, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'11':5 '2331':1 '6w5':10 'apt':4 'british':7 'columbia':8 'road':3 'spruce':2 'v3j6':9 'vancouv':6
157	Roslindale Village Square	750000	https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800	2024-06-26 23:03:42.696198	\N	f	5258f30b-584c-47ab-9377-0af6e65575a7	bos_house_296	{"bedrooms": 3, "bathrooms": 2, "sqft": 1600, "type": "House", "description": "Community-focused home in Roslindale Village with local shops and farmers market."}	melissa.collins@email.com	\N	\N	7643	Birch Avenue	\N	Vancouver	British Columbia	V6K6 1G8	Canada	49.25607610	-123.09224514	7643 Birch Avenue, Vancouver, British Columbia, V6K6 1G8, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1g8':8 '7643':1 'avenu':3 'birch':2 'british':5 'columbia':6 'v6k6':7 'vancouv':4
158	Leather District Converted	1450000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2024-06-23 23:03:42.696198	\N	f	32c4293f-9e20-467f-8f81-32fd2b480608	bos_loft_297	{"bedrooms": 2, "bathrooms": 2, "sqft": 1500, "type": "Loft", "description": "Converted loft in historic Leather District with downtown proximity and character."}	andrew.sullivan@email.com	\N	\N	7663	Cambie Street	Unit 44	North Vancouver	British Columbia	V3G2 9Y6	Canada	49.31340600	-123.10131175	7663 Cambie Street, Unit 44, North Vancouver, British Columbia, V3G2 9Y6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'44':5 '7663':1 '9y6':11 'british':8 'cambi':2 'columbia':9 'north':6 'street':3 'unit':4 'v3g2':10 'vancouv':7
159	Fenway Park Area	850000	https://images.unsplash.com/photo-1600607688066-890987cd4af7?w=800	2024-06-20 23:03:42.696198	\N	f	7e0989e4-51a1-4c76-beea-36055b782353	bos_condo_298	{"bedrooms": 1, "bathrooms": 1, "sqft": 800, "type": "Condo", "description": "Convenient condo near Fenway Park with sports and entertainment proximity."}	nicole.kennedy@email.com	\N	\N	8645	Elm Street	\N	Richmond	British Columbia	V5B5 9K5	Canada	49.17466217	-123.12218593	8645 Elm Street, Richmond, British Columbia, V5B5 9K5, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'8645':1 '9k5':8 'british':5 'columbia':6 'elm':2 'richmond':4 'street':3 'v5b5':7
160	Medford Hillside Home	650000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2024-06-17 23:03:42.696198	\N	f	71036718-1e05-48c1-a335-812fd81f96be	bos_house_299	{"bedrooms": 3, "bathrooms": 2, "sqft": 1500, "type": "House", "description": "Hillside home in Medford with suburban feel and T access to downtown Boston."}	timothy.murphy@email.com	\N	\N	7965	Cambie Street	Apt 18	Richmond	British Columbia	V7B8 6Y5	Canada	49.15251996	-123.12897915	7965 Cambie Street, Apt 18, Richmond, British Columbia, V7B8 6Y5, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'18':5 '6y5':10 '7965':1 'apt':4 'british':7 'cambi':2 'columbia':8 'richmond':6 'street':3 'v7b8':9
161	Malden Downtown Transit	450000	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	2024-06-14 23:03:42.696198	\N	f	42ad95ea-c2a9-4e6d-81f6-876bab9fcc6c	bos_apt_300	{"bedrooms": 2, "bathrooms": 1, "sqft": 900, "type": "Apartment", "description": "Transit-oriented apartment in Malden with Orange Line access and affordability."}	karen.reilly@email.com	\N	\N	9899	Granville Street	\N	Richmond	British Columbia	V4L5 9Z9	Canada	49.14347807	-123.14396667	9899 Granville Street, Richmond, British Columbia, V4L5 9Z9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'9899':1 '9z9':8 'british':5 'columbia':6 'granvill':2 'richmond':4 'street':3 'v4l5':7
162	Quincy Adams Heritage	550000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2024-06-11 23:03:42.696198	\N	f	f05a5279-9678-46b4-b2db-879b474cb6fe	bos_condo_301	{"bedrooms": 2, "bathrooms": 2, "sqft": 1100, "type": "Condo", "description": "Heritage condo in Quincy with presidential history and Red Line convenience."}	robert.barry@email.com	\N	\N	8626	Willow Way	\N	Burnaby	British Columbia	V4N3 7M0	Canada	49.27359463	-122.96335701	8626 Willow Way, Burnaby, British Columbia, V4N3 7M0, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'7m0':8 '8626':1 'british':5 'burnabi':4 'columbia':6 'v4n3':7 'way':3 'willow':2
163	Watertown Charles River	850000	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800	2024-06-08 23:03:42.696198	\N	f	dee343c6-be7d-4875-80d0-85de7a5bcbcc	bos_house_302	{"bedrooms": 3, "bathrooms": 2, "sqft": 1700, "type": "House", "description": "Riverside home in Watertown with Charles River access and outdoor recreation."}	sharon.lynch@email.com	\N	\N	915	Cherry Street	\N	Vancouver	British Columbia	V3C7 7H6	Canada	49.28229776	-123.16953202	915 Cherry Street, Vancouver, British Columbia, V3C7 7H6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'7h6':8 '915':1 'british':5 'cherri':2 'columbia':6 'street':3 'v3c7':7 'vancouv':4
164	Waltham Tech Corridor	750000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2024-06-05 23:03:42.696198	\N	f	b28c801a-e23c-4740-a0f6-9ba690cc39c6	bos_loft_303	{"bedrooms": 2, "bathrooms": 2, "sqft": 1300, "type": "Loft", "description": "Modern loft in Waltham tech corridor with innovation economy and commuter rail."}	gregory.burke@email.com	\N	\N	3781	Hemlock Street	Unit 19	New Westminster	British Columbia	V5J0 5X8	Canada	49.20113575	-122.91880102	3781 Hemlock Street, Unit 19, New Westminster, British Columbia, V5J0 5X8, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'19':5 '3781':1 '5x8':11 'british':8 'columbia':9 'hemlock':2 'new':6 'street':3 'unit':4 'v5j0':10 'westminst':7
165	Arlington Heights Suburb	650000	https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800	2024-06-02 23:03:42.696198	\N	f	fc3dc2b0-6c3e-4102-873d-069ef445f64c	bos_condo_304	{"bedrooms": 2, "bathrooms": 2, "sqft": 1200, "type": "Condo", "description": "Suburban condo in Arlington Heights with family-friendly community and good schools."}	patricia.doyle@email.com	\N	\N	2597	Cedar Lane	\N	Coquitlam	British Columbia	V3L5 2B9	Canada	49.29571747	-122.80244834	2597 Cedar Lane, Coquitlam, British Columbia, V3L5 2B9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2597':1 '2b9':8 'british':5 'cedar':2 'columbia':6 'coquitlam':4 'lane':3 'v3l5':7
166	Belmont Hill Country Club	1650000	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800	2024-05-30 23:03:42.696198	\N	f	2673f7de-fbe4-4c6d-90b9-511f56a162ad	bos_house_305	{"bedrooms": 4, "bathrooms": 3, "sqft": 2300, "type": "House", "description": "Upscale home in Belmont near Hill Country Club with prestige and amenities."}	thomas.hayes@email.com	\N	\N	4655	Cherry Street	Unit 16	Richmond	British Columbia	V4J3 3C5	Canada	49.15784966	-123.11003655	4655 Cherry Street, Unit 16, Richmond, British Columbia, V4J3 3C5, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'16':5 '3c5':10 '4655':1 'british':7 'cherri':2 'columbia':8 'richmond':6 'street':3 'unit':4 'v4j3':9
167	Revere Beach Oceanfront	520000	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800	2024-05-27 23:03:42.696198	\N	f	de70e650-bafc-4aef-bf57-c5f0aa505353	bos_apt_306	{"bedrooms": 1, "bathrooms": 1, "sqft": 750, "type": "Apartment", "description": "Oceanfront apartment in Revere Beach with blue line access and beach lifestyle."}	deborah.cox@email.com	\N	\N	2792	Elm Street	\N	New Westminster	British Columbia	V7H0 9X3	Canada	49.19821426	-122.90483920	2792 Elm Street, New Westminster, British Columbia, V7H0 9X3, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2792':1 '9x3':9 'british':6 'columbia':7 'elm':2 'new':4 'street':3 'v7h0':8 'westminst':5
168	Chelsea Waterfront Development	480000	https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800	2024-05-24 23:03:42.696198	\N	f	37e89b62-707c-48d5-8263-6520d35eb50d	bos_condo_307	{"bedrooms": 1, "bathrooms": 1, "sqft": 650, "type": "Condo", "description": "New development condo in Chelsea waterfront with Silver Line access and affordability."}	john.moran@email.com	\N	\N	7652	Elm Street	Apt 14	Burnaby	British Columbia	V5R9 1L2	Canada	49.23190404	-122.97177152	7652 Elm Street, Apt 14, Burnaby, British Columbia, V5R9 1L2, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'14':5 '1l2':10 '7652':1 'apt':4 'british':7 'burnabi':6 'columbia':8 'elm':2 'street':3 'v5r9':9
169	Milton Blue Hills Reservation	950000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2024-05-21 23:03:42.696198	\N	f	0b7c31b2-1d8d-4a45-ad72-f145fe24a1b8	bos_house_308	{"bedrooms": 3, "bathrooms": 3, "sqft": 1900, "type": "House", "description": "Home near Blue Hills Reservation in Milton with hiking trails and nature access."}	susan.flanagan@email.com	\N	\N	9542	Cambie Street	\N	Vancouver	British Columbia	V7X1 3R8	Canada	49.25690120	-123.13332135	9542 Cambie Street, Vancouver, British Columbia, V7X1 3R8, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'3r8':8 '9542':1 'british':5 'cambi':2 'columbia':6 'street':3 'v7x1':7 'vancouv':4
170	Everett Assembly Row	650000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2024-05-18 23:03:42.696198	\N	f	638a2c9f-8d82-4129-bca7-bfa810868867	bos_loft_309	{"bedrooms": 1, "bathrooms": 2, "sqft": 1000, "type": "Loft", "description": "Modern loft near Assembly Row with Orange Line access and entertainment district."}	mark.mcnamara@email.com	\N	\N	3515	Granville Street	Apt 5	New Westminster	British Columbia	V3X2 7K4	Canada	49.20531027	-122.92549125	3515 Granville Street, Apt 5, New Westminster, British Columbia, V3X2 7K4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'3515':1 '5':5 '7k4':11 'apt':4 'british':8 'columbia':9 'granvill':2 'new':6 'street':3 'v3x2':10 'westminst':7
171	Lynn General Electric Heritage	380000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2024-05-15 23:03:42.696198	\N	f	776e18c3-d24e-4077-8d7d-a3e971c109e7	bos_condo_310	{"bedrooms": 2, "bathrooms": 1, "sqft": 1000, "type": "Condo", "description": "Heritage condo in Lynn with industrial history and affordable Commuter Rail access."}	linda.coleman@email.com	\N	\N	979	Commercial Drive	\N	Surrey	British Columbia	V7M0 2M7	Canada	49.21498370	-122.84955508	979 Commercial Drive, Surrey, British Columbia, V7M0 2M7, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2m7':8 '979':1 'british':5 'columbia':6 'commerci':2 'drive':3 'surrey':4 'v7m0':7
172	Salem Witch City Historic	750000	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800	2024-05-12 23:03:42.696198	\N	f	52966e68-3dbb-4976-9f82-52895861d7ac	bos_house_311	{"bedrooms": 3, "bathrooms": 2, "sqft": 1600, "type": "House", "description": "Historic home in Salem Witch City with colonial heritage and tourism economy."}	william.brady@email.com	\N	\N	3697	Cedar Lane	Unit 33	West Vancouver	British Columbia	V4G1 2T5	Canada	49.32068083	-123.14614252	3697 Cedar Lane, Unit 33, West Vancouver, British Columbia, V4G1 2T5, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2t5':11 '33':5 '3697':1 'british':8 'cedar':2 'columbia':9 'lane':3 'unit':4 'v4g1':10 'vancouv':7 'west':6
173	Lowell Mill City Renaissance	320000	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800	2024-05-09 23:03:42.696198	\N	f	b9c899d9-f5c8-41f3-b678-3faaa92c11bd	bos_apt_312	{"bedrooms": 2, "bathrooms": 1, "sqft": 900, "type": "Apartment", "description": "Affordable apartment in Lowell Mill City with industrial heritage and renaissance."}	nancy.griffin@email.com	\N	\N	7567	Fir Avenue	\N	New Westminster	British Columbia	V4X3 8S9	Canada	49.21592088	-122.91928365	7567 Fir Avenue, New Westminster, British Columbia, V4X3 8S9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'7567':1 '8s9':9 'avenu':3 'british':6 'columbia':7 'fir':2 'new':4 'v4x3':8 'westminst':5
174	Lawrence Immigrant Gateway	280000	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	2024-05-06 23:03:42.696198	\N	f	eff8fe4a-6530-4a17-8e41-cb681ef5f7d1	bos_condo_313	{"bedrooms": 1, "bathrooms": 1, "sqft": 700, "type": "Condo", "description": "Gateway condo in Lawrence with diverse immigrant community and affordable living."}	joseph.harrison@email.com	\N	\N	4683	Hemlock Street	Unit 43	Vancouver	British Columbia	V3M1 9R9	Canada	49.29365042	-123.08433948	4683 Hemlock Street, Unit 43, Vancouver, British Columbia, V3M1 9R9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'43':5 '4683':1 '9r9':10 'british':7 'columbia':8 'hemlock':2 'street':3 'unit':4 'v3m1':9 'vancouv':6
175	Haverhill Merrimack River	420000	https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800	2024-05-03 23:03:42.696198	\N	f	433b8451-2785-4c65-aabc-dd17e102bd7a	bos_house_314	{"bedrooms": 3, "bathrooms": 2, "sqft": 1400, "type": "House", "description": "Riverside home in Haverhill with Merrimack River access and historic downtown."}	margaret.kelly@email.com	\N	\N	5914	Spruce Road	Unit 21	New Westminster	British Columbia	V7B9 3H6	Canada	49.21348979	-122.91242541	5914 Spruce Road, Unit 21, New Westminster, British Columbia, V7B9 3H6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'21':5 '3h6':11 '5914':1 'british':8 'columbia':9 'new':6 'road':3 'spruce':2 'unit':4 'v7b9':10 'westminst':7
176	Brockton Shoe City Legacy	350000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2024-04-30 23:03:42.696198	\N	f	d878556c-a60c-4dda-aaf5-10e07133f783	bos_loft_315	{"bedrooms": 1, "bathrooms": 1, "sqft": 800, "type": "Loft", "description": "Legacy loft in Brockton Shoe City with industrial heritage and affordable living."}	richard.casey@email.com	\N	\N	248	Fraser Street	Unit 2	New Westminster	British Columbia	V5S2 5B5	Canada	49.20144164	-122.90473451	248 Fraser Street, Unit 2, New Westminster, British Columbia, V5S2 5B5, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2':5 '248':1 '5b5':11 'british':8 'columbia':9 'fraser':2 'new':6 'street':3 'unit':4 'v5s2':10 'westminst':7
177	Fall River Portuguese Heritage	320000	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800	2024-04-27 23:03:42.696198	\N	f	d2f00c9b-3bfb-4056-a681-81239dac95f7	bos_condo_316	{"bedrooms": 2, "bathrooms": 1, "sqft": 1000, "type": "Condo", "description": "Heritage condo in Fall River with Portuguese culture and textile industry history."}	barbara.murphy@email.com	\N	\N	1699	Hemlock Street	\N	Surrey	British Columbia	V4H9 9E4	Canada	49.16963620	-122.83654554	1699 Hemlock Street, Surrey, British Columbia, V4H9 9E4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'1699':1 '9e4':8 'british':5 'columbia':6 'hemlock':2 'street':3 'surrey':4 'v4h9':7
21	Manhattan Upper East Side Penthouse	4200000	https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800	2025-06-08 23:03:34.188523	\N	f	d4045436-f539-4865-86d5-d905274a630e	ny_apt_161	{"bedrooms": 4, "bathrooms": 4, "sqft": 3200, "type": "Penthouse", "description": "Elegant pre-war penthouse with Central Park views and classic Manhattan luxury."}	alexandra.chen@email.com	\N	\N	4111	Douglas Road	\N	Vancouver	British Columbia	V5A0 7S7	Canada	49.26230384	-123.10464434	4111 Douglas Road, Vancouver, British Columbia, V5A0 7S7, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4111':1 '7s7':8 'british':5 'columbia':6 'dougla':2 'road':3 'v5a0':7 'vancouv':4
22	SoHo Industrial Loft	2800000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2025-06-11 23:03:34.188523	\N	f	ecdd7e20-325b-4ffa-9c74-ede3ec4915fe	ny_loft_162	{"bedrooms": 2, "bathrooms": 2, "sqft": 2000, "type": "Loft", "description": "Converted industrial loft in historic SoHo cast-iron building with soaring ceilings."}	marcus.wright@email.com	\N	\N	903	Elm Street	Apt 12	Surrey	British Columbia	V3A0 3A1	Canada	49.19405063	-122.86166571	903 Elm Street, Apt 12, Surrey, British Columbia, V3A0 3A1, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'12':5 '3a1':10 '903':1 'apt':4 'british':7 'columbia':8 'elm':2 'street':3 'surrey':6 'v3a0':9
23	Brooklyn Heights Waterfront	1850000	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800	2025-06-14 23:03:34.188523	\N	f	abee3a41-4ff4-489e-b8a7-93e96bbf92f9	ny_condo_163	{"bedrooms": 3, "bathrooms": 2, "sqft": 1600, "type": "Condo", "description": "Modern waterfront condo with stunning Manhattan skyline and bridge views."}	sofia.rivera@email.com	\N	\N	3249	Cedar Lane	\N	Surrey	British Columbia	V6H4 3K6	Canada	49.18324134	-122.86945540	3249 Cedar Lane, Surrey, British Columbia, V6H4 3K6, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'3249':1 '3k6':8 'british':5 'cedar':2 'columbia':6 'lane':3 'surrey':4 'v6h4':7
24	Greenwich Village Brownstone Duplex	3500000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2025-06-17 23:03:34.188523	\N	f	9595d788-8414-4c88-b398-88b705b5aca0	ny_apt_164	{"bedrooms": 3, "bathrooms": 3, "sqft": 2400, "type": "Duplex", "description": "Charming duplex in historic Greenwich Village brownstone with private garden."}	jonathan.kim@email.com	\N	\N	8573	Oak Avenue	Unit 30	Coquitlam	British Columbia	V7V1 6X9	Canada	49.28659169	-122.79988275	8573 Oak Avenue, Unit 30, Coquitlam, British Columbia, V7V1 6X9, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'30':5 '6x9':10 '8573':1 'avenu':3 'british':7 'columbia':8 'coquitlam':6 'oak':2 'unit':4 'v7v1':9
25	Tribeca Luxury High-Rise	5200000	https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800	2025-06-20 23:03:34.188523	\N	f	339b8b45-fd44-4c9f-9f87-7a1d8cd80878	ny_apt_165	{"bedrooms": 3, "bathrooms": 3, "sqft": 2200, "type": "Condo", "description": "Ultra-luxury condo in iconic Tribeca tower with world-class amenities."}	natasha.petrov@email.com	\N	\N	4889	Cedar Lane	\N	Surrey	British Columbia	V6Z4 9A4	Canada	49.17309762	-122.85208015	4889 Cedar Lane, Surrey, British Columbia, V6Z4 9A4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4889':1 '9a4':8 'british':5 'cedar':2 'columbia':6 'lane':3 'surrey':4 'v6z4':7
26	Lower East Side Modern	1250000	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800	2025-06-23 23:03:34.188523	\N	f	cff6462f-e039-4c34-90e7-6df0c2c8d40f	ny_apt_166	{"bedrooms": 2, "bathrooms": 2, "sqft": 1100, "type": "Condo", "description": "Contemporary condo in vibrant Lower East Side with rooftop terrace access."}	carlos.mendez@email.com	\N	\N	3891	Fraser Street	\N	New Westminster	British Columbia	V3R9 3R3	Canada	49.21104021	-122.90314895	3891 Fraser Street, New Westminster, British Columbia, V3R9 3R3, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'3891':1 '3r3':9 'british':6 'columbia':7 'fraser':2 'new':4 'street':3 'v3r9':8 'westminst':5
31	Flatiron District Loft	2200000	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800	2025-07-05 23:03:34.188523	\N	f	644741a8-d2a8-4a02-a54b-62f483dea37e	ny_apt_171	{"bedrooms": 2, "bathrooms": 2, "sqft": 1700, "type": "Loft", "description": "Spacious loft in historic Flatiron building with original tin ceilings."}	anastasia.petrov@email.com	\N	\N	5998	Elm Street	\N	New Westminster	British Columbia	V6J0 4H4	Canada	49.20033776	-122.90916656	5998 Elm Street, New Westminster, British Columbia, V6J0 4H4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'4h4':9 '5998':1 'british':6 'columbia':7 'elm':2 'new':4 'street':3 'v6j0':8 'westminst':5
178	New Bedford Whaling Heritage	450000	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800	2024-04-24 23:03:42.696198	\N	f	bed9df08-c0e2-4590-a398-cac17161be62	bos_house_317	{"bedrooms": 3, "bathrooms": 2, "sqft": 1300, "type": "House", "description": "Whaling heritage home in New Bedford with maritime history and cultural significance."}	charles.rogers@email.com	\N	\N	9813	Cambie Street	Unit 30	New Westminster	British Columbia	V5R6 2J4	Canada	49.20030985	-122.90722748	9813 Cambie Street, Unit 30, New Westminster, British Columbia, V5R6 2J4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'2j4':11 '30':5 '9813':1 'british':8 'cambi':2 'columbia':9 'new':6 'street':3 'unit':4 'v5r6':10 'westminst':7
179	Framingham MetroWest Hub	480000	https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800	2024-04-21 23:03:42.696198	\N	f	4b42b814-6fdc-4331-b946-d12abc62bb5f	bos_apt_318	{"bedrooms": 2, "bathrooms": 1, "sqft": 950, "type": "Apartment", "description": "Hub apartment in Framingham MetroWest with commuter rail and diverse community."}	elizabeth.ward@email.com	\N	\N	3230	Birch Avenue	\N	Coquitlam	British Columbia	V3T7 7A4	Canada	49.28751187	-122.78393139	3230 Birch Avenue, Coquitlam, British Columbia, V3T7 7A4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'3230':1 '7a4':8 'avenu':3 'birch':2 'british':5 'columbia':6 'coquitlam':4 'v3t7':7
180	Marlborough Tech Route 495	520000	https://images.unsplash.com/photo-1600607688066-890987cd4af7?w=800	2024-04-18 23:03:42.696198	\N	f	0bc66568-f859-4cc4-b6a1-1b708da64d89	bos_condo_319	{"bedrooms": 2, "bathrooms": 2, "sqft": 1100, "type": "Condo", "description": "Tech corridor condo in Marlborough on Route 495 with innovation economy access."}	jennifer.torres@email.com	\N	\N	7406	Spruce Road	Unit 17	Surrey	British Columbia	V3B2 9S7	Canada	49.20886689	-122.83264199	7406 Spruce Road, Unit 17, Surrey, British Columbia, V3B2 9S7, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'17':5 '7406':1 '9s7':10 'british':7 'columbia':8 'road':3 'spruce':2 'surrey':6 'unit':4 'v3b2':9
181	Worcester Worcester County Seat	380000	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800	2024-04-15 23:03:42.696198	\N	f	53cc1a9e-b395-456f-8491-f55934602e7c	bos_house_320	{"bedrooms": 3, "bathrooms": 2, "sqft": 1250, "type": "House", "description": "County seat home in Worcester with academic institutions and cultural attractions."}	michelle.rivera@email.com	\N	\N	1981	Cherry Street	Apt 15	West Vancouver	British Columbia	V3N7 6S4	Canada	49.32296189	-123.15735372	1981 Cherry Street, Apt 15, West Vancouver, British Columbia, V3N7 6S4, Canada	residential	9fae85d0-eedd-4c96-90d7-0af942d565d7	'15':5 '1981':1 '6s4':11 'apt':4 'british':8 'cherri':2 'columbia':9 'street':3 'v3n7':10 'vancouv':7 'west':6
\.


--
-- Data for Name: saved_properties; Type: TABLE DATA; Schema: public; Owner: craig
--

COPY public.saved_properties (id, user_email, property_uid, created_at) FROM stdin;
3	craigpestell@gmail.com	SEED-PROP-002	2025-07-05 20:38:49.242249
6	craigpestell@gmail.com	SEED-PROP-008	2025-07-05 20:41:31.89547
10	craigpestell@gmail.com	PROP-1751157039.932465-4	2025-07-05 20:54:42.906147
210	alexandra.chen@email.com	ny_loft_162	2025-06-30 23:15:02.065528
211	marcus.wright@email.com	ny_apt_161	2025-07-02 23:15:02.065528
212	sofia.rivera@email.com	ny_apt_165	2025-06-28 23:15:02.065528
213	jonathan.kim@email.com	ny_apt_168	2025-07-03 23:15:02.065528
214	carlos.mendez@email.com	ny_apt_171	2025-06-27 23:15:02.065528
215	elena.vasquez@email.com	ny_apt_175	2025-07-04 23:15:02.065528
216	dmitri.volkov@email.com	ny_apt_169	2025-07-01 23:15:02.065528
217	isabelle.laurent@email.com	ny_apt_178	2025-06-29 23:15:02.065528
218	pierre.dubois@email.com	ny_apt_177	2025-06-26 23:15:02.065528
219	anastasia.petrov@email.com	ny_apt_180	2025-07-02 23:15:02.065528
220	carlos.santos@email.com	mia_apt_201	2025-07-01 23:15:02.065528
221	maria.rodriguez@email.com	mia_condo_202	2025-07-03 23:15:02.065528
222	jose.fernandez@email.com	mia_house_203	2025-06-28 23:15:02.065528
223	ana.lopez@email.com	mia_condo_206	2025-06-30 23:15:02.065528
224	ricardo.morales@email.com	mia_house_205	2025-07-02 23:15:02.065528
225	diego.herrera@email.com	mia_condo_207	2025-06-27 23:15:02.065528
226	fernanda.silva@email.com	mia_house_208	2025-07-04 23:15:02.065528
227	pablo.gutierrez@email.com	mia_condo_209	2025-06-29 23:15:02.065528
228	valentina.castro@email.com	mia_house_210	2025-07-01 23:15:02.065528
229	gabriel.mendoza@email.com	mia_condo_211	2025-06-26 23:15:02.065528
230	jonathan.kim@email.com	mia_house_203	2025-06-30 23:15:02.065528
231	elena.vasquez@email.com	mia_condo_202	2025-07-02 23:15:02.065528
232	dmitri.volkov@email.com	mia_apt_201	2025-06-28 23:15:02.065528
233	pierre.dubois@email.com	mia_house_205	2025-07-03 23:15:02.065528
234	carlos.santos@email.com	ny_apt_176	2025-07-01 23:15:02.065528
235	maria.rodriguez@email.com	ny_apt_165	2025-06-29 23:15:02.065528
236	jose.fernandez@email.com	ny_apt_161	2025-06-27 23:15:02.065528
237	ana.lopez@email.com	ny_apt_171	2025-07-04 23:15:02.065528
238	alexandra.chen@email.com	mia_condo_206	2025-06-25 23:15:02.065528
239	marcus.wright@email.com	mia_house_208	2025-06-23 23:15:02.065528
240	sofia.rivera@email.com	ny_apt_180	2025-06-20 23:15:02.065528
241	carlos.mendez@email.com	mia_condo_209	2025-06-24 23:15:02.065528
242	isabelle.laurent@email.com	mia_house_210	2025-06-22 23:15:02.065528
243	ricardo.morales@email.com	ny_apt_177	2025-06-21 23:15:02.065528
244	diego.herrera@email.com	ny_apt_169	2025-06-19 23:15:02.065528
245	fernanda.silva@email.com	ny_apt_175	2025-06-18 23:15:02.065528
246	pablo.gutierrez@email.com	ny_apt_168	2025-06-17 23:15:02.065528
247	valentina.castro@email.com	ny_apt_178	2025-06-16 23:15:02.065528
248	craigpestell@gmail.com	ny_apt_171	2025-07-05 23:29:50.060121
249	craigpestell@gmail.com	SEED-PROP-005	2025-07-05 23:29:55.566702
250	seller2@example.com	PROP-MCR0GQYK-PHVQPI	2025-07-05 23:47:58.224353
252	seller2@example.com	SEED-PROP-005	2025-07-06 01:48:32.680104
253	seller2@example.com	ny_apt_170	2025-07-06 01:48:35.388155
254	seller2@example.com	ny_apt_173	2025-07-06 01:48:36.837907
255	seller2@example.com	ny_apt_172	2025-07-06 01:48:38.199779
256	seller2@example.com	SEED-PROP-003	2025-07-06 01:48:39.682128
257	seller2@example.com	PROP-1751162522.632568-6	2025-07-06 01:48:44.563853
258	seller2@example.com	PROP-1751157039.932465-5	2025-07-06 01:48:46.297697
259	seller2@example.com	ny_apt_175	2025-07-06 01:48:52.129546
260	seller2@example.com	ny_apt_176	2025-07-06 01:48:53.776092
261	seller2@example.com	ny_loft_162	2025-07-06 01:48:58.840955
262	seller2@example.com	ny_apt_161	2025-07-06 01:49:00.089276
263	seller2@example.com	ny_apt_171	2025-07-06 10:28:52.4762
264	seller1@example.com	PROP-MCR0GQYK-PHVQPI	2025-07-06 14:17:10.377079
265	seller1@example.com	SEED-PROP-001	2025-07-06 14:17:24.879836
266	seller1@example.com	ny_apt_171	2025-07-06 14:17:34.240557
267	seller1@example.com	SEED-PROP-004	2025-07-06 17:07:40.175955
268	seller1@example.com	ny_apt_188	2025-07-06 17:07:57.475796
269	seller1@example.com	ny_apt_184	2025-07-06 17:07:58.936938
270	seller1@example.com	SEED-PROP-003	2025-07-06 17:08:13.57182
271	seller1@example.com	ny_apt_168	2025-07-06 17:08:15.546477
272	seller1@example.com	ny_apt_170	2025-07-06 17:08:16.767786
273	seller1@example.com	PROP-MCSCYO04-SS2BC3	2025-07-06 17:25:13.916644
\.


--
-- Data for Name: showing_times; Type: TABLE DATA; Schema: public; Owner: craig
--

COPY public.showing_times (id, property_uid, start_time, end_time, created_at, updated_at) FROM stdin;
21	SEED-PROP-003	2025-07-09 08:15:00-07	2025-07-09 11:45:00-07	2025-07-06 16:38:00.088572	2025-07-06 16:38:00.088572
22	PROP-MCS6FKDA-67EV2T	2025-07-07 08:15:00-07	2025-07-07 10:00:00-07	2025-07-06 16:38:35.445322	2025-07-06 16:38:35.445322
24	SEED-PROP-003	2025-07-07 20:00:00-07	2025-07-07 21:00:00-07	2025-07-06 16:43:02.331505	2025-07-06 16:43:02.331505
25	PROP-1751157039.932465-5	2025-07-07 10:00:00-07	2025-07-07 11:00:00-07	2025-07-06 16:44:31.538628	2025-07-06 16:44:31.538628
26	PROP-1751162522.632568-6	2025-07-07 10:30:00-07	2025-07-07 11:30:00-07	2025-07-06 16:44:31.54132	2025-07-06 16:44:31.54132
27	PROP-1751162522.632568-8	2025-07-07 10:45:00-07	2025-07-07 11:15:00-07	2025-07-06 16:44:31.542267	2025-07-06 16:44:31.542267
28	SEED-PROP-002	2025-07-10 08:30:00-07	2025-07-10 10:15:00-07	2025-07-06 16:46:08.92189	2025-07-06 16:46:08.92189
29	SEED-PROP-002	2025-07-07 08:15:00-07	2025-07-07 10:15:00-07	2025-07-06 16:46:11.693529	2025-07-06 16:46:11.693529
30	PROP-MCS6FKDA-67EV2T	2025-07-08 08:45:00-07	2025-07-08 10:30:00-07	2025-07-06 17:01:10.287026	2025-07-06 17:01:10.287026
\.


--
-- Data for Name: showings; Type: TABLE DATA; Schema: public; Owner: craig
--

COPY public.showings (id, property_uid, date, "time", user_name, user_email, created_at) FROM stdin;
1	PROP-MCS6FKDA-67EV2T	2025-07-06	06:00:00	Sarah Thompson	seller1@example.com	2025-07-06 14:57:17.162727
\.


--
-- Data for Name: user_notifications; Type: TABLE DATA; Schema: public; Owner: craig
--

COPY public.user_notifications (notification_id, user_email, title, message, type, related_offer_id, related_property_uid, read_at, created_at, priority, related_offer_uid) FROM stdin;
3	buyer2@example.com	Offer Accepted!	Congratulations! Your offer on the Downtown Loft has been accepted.	offer_accepted	\N	\N	\N	2025-07-05 16:37:35.557453	high	\N
4	seller1@example.com	Offer Accepted!	Great news! Your offer on the Modern Downtown Condo has been accepted.	offer_accepted	\N	\N	2025-07-05 16:49:40.132213	2025-07-05 16:43:45.409135	high	\N
2	seller1@example.com	New Offer Alert	You have received a new offer on your Victorian Family Home for $465,000	offer_received	\N	\N	2025-07-05 16:51:10.776618	2025-07-05 16:37:35.557453	high	\N
7	seller1@example.com	Inspection Reminder	Don't forget: Your property inspection is scheduled for tomorrow. Click to view property details.	reminder	\N	SEED-PROP-004	2025-07-05 17:36:02.045264	2025-07-05 17:32:43.60912	normal	\N
16	seller1@example.com	Inspection Reminder	Don't forget: Your property inspection is scheduled for tomorrow. Click to view property details.	reminder	\N	SEED-PROP-004	2025-07-05 18:14:35.605562	2025-07-05 17:50:43.941021	normal	\N
6	seller1@example.com	Counter Offer	The seller has made a counter offer on your Cozy Suburban Home offer. Click to view the updated offer.	offer_countered	3	SEED-PROP-003	2025-07-05 17:33:35.410927	2025-07-05 17:32:43.09121	normal	OFFER-ECCBC87E-3
5	seller1@example.com	New Offer Received	You have received a new offer on your Luxury Villa property. Click to view the offer details.	offer_received	2	SEED-PROP-002	2025-07-05 17:34:43.520431	2025-07-05 17:32:42.561586	high	OFFER-C81E728D-2
12	seller1@example.com	Offer Accepted!	Great news! Your offer on the Modern Downtown Condo has been accepted. Click to view the offer details.	offer_accepted	1	SEED-PROP-001	2025-07-05 17:49:38.7048	2025-07-05 17:42:31.370768	high	OFFER-C4CA4238-1
15	seller1@example.com	Counter Offer	The seller has made a counter offer on your Cozy Suburban Home offer. Click to view the updated offer.	offer_countered	3	SEED-PROP-003	2025-07-05 18:17:52.997062	2025-07-05 17:50:43.416342	normal	OFFER-ECCBC87E-3
13	seller1@example.com	Offer Accepted!	Great news! Your offer on the Modern Downtown Condo has been accepted. Click to view the offer details.	offer_accepted	1	SEED-PROP-001	2025-07-05 18:18:14.903548	2025-07-05 17:50:35.564187	high	OFFER-C4CA4238-1
11	seller1@example.com	Inspection Reminder	Don't forget: Your property inspection is scheduled for tomorrow. Click to view property details.	reminder	\N	SEED-PROP-004	2025-07-05 18:18:23.126544	2025-07-05 17:40:48.66262	normal	\N
14	seller1@example.com	New Offer Received	You have received a new offer on your Luxury Villa property. Click to view the offer details.	offer_received	2	SEED-PROP-002	2025-07-05 19:26:28.55608	2025-07-05 17:50:42.889138	high	OFFER-C81E728D-2
17	test@example.com	Welcome to Real Estate Marketplace!	Thank you for joining our platform. Start browsing properties and making offers today!	system	\N	\N	\N	2025-07-05 23:36:37.574073	normal	\N
18	test@example.com	New Property Match	A new property matching your criteria has been listed: 3BR house in Downtown	system	\N	\N	\N	2025-07-05 23:36:37.574073	normal	\N
19	test@example.com	Offer Update	Your offer on the 2BR apartment has been reviewed by the seller	offer_received	\N	\N	\N	2025-07-05 23:36:37.574073	high	\N
20	craig@example.com	Welcome to Real Estate Marketplace!	Thank you for joining our platform. Start browsing properties and making offers today!	system	\N	\N	\N	2025-07-05 23:36:58.333948	normal	\N
21	craig@example.com	New Property Alert	A 4BR house in your preferred area has just been listed for $750,000	system	\N	\N	\N	2025-07-05 23:36:58.333948	high	\N
22	user@example.com	Platform Welcome	Welcome to our real estate marketplace! Explore thousands of properties.	system	\N	\N	\N	2025-07-05 23:36:58.333948	normal	\N
23	admin@example.com	System Notification	Your account has been set up successfully.	system	\N	\N	\N	2025-07-05 23:36:58.333948	normal	\N
24	seller2@example.com	New Offer Received	You have received a new offer on your Luxury Villa property. Click to view the offer details.	offer_received	\N	SEED-PROP-002	2025-07-05 23:46:58.418609	2025-07-05 23:38:46.141414	high	OFFER-TEST-002
25	seller2@example.com	Counter Offer	The seller has made a counter offer on your Cozy Suburban Home offer. Click to view the updated offer.	offer_countered	\N	SEED-PROP-003	2025-07-05 23:46:58.418609	2025-07-05 23:38:46.66544	normal	OFFER-TEST-003
26	seller2@example.com	Inspection Reminder	Don't forget: Your property inspection is scheduled for tomorrow. Click to view property details.	reminder	\N	SEED-PROP-004	2025-07-05 23:46:58.418609	2025-07-05 23:38:47.18344	normal	\N
1	buyer1@example.com	Welcome to the Platform!	Welcome to our real estate marketplace. Start browsing properties and making offers!	system	\N	\N	2025-07-06 10:29:59.878776	2025-07-05 16:37:35.557453	normal	\N
8	seller1@example.com	Offer Accepted!	Great news! Your offer on the Modern Downtown Condo has been accepted. Click to view the offer details.	offer_accepted	1	SEED-PROP-001	2025-07-06 10:30:45.299248	2025-07-05 17:40:02.701016	high	OFFER-C4CA4238-1
9	seller1@example.com	New Offer Received	You have received a new offer on your Luxury Villa property. Click to view the offer details.	offer_received	2	SEED-PROP-002	2025-07-06 10:30:45.299248	2025-07-05 17:40:47.628601	high	OFFER-C81E728D-2
10	seller1@example.com	Counter Offer	The seller has made a counter offer on your Cozy Suburban Home offer. Click to view the updated offer.	offer_countered	3	SEED-PROP-003	2025-07-06 10:30:45.299248	2025-07-05 17:40:48.147145	normal	OFFER-ECCBC87E-3
27	seller1@example.com	New Offer Received!	New offer of $45,000 received for "Stunning Victorian Family Home"	offer_received	\N	SEED-PROP-001	2025-07-06 10:30:45.299248	2025-07-06 10:30:25.171964	high	OFFER-MCRY7574-FHTIM0
\.


--
-- Name: app_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: craig
--

SELECT pg_catalog.setval('public.app_config_id_seq', 1, true);


--
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: craig
--

SELECT pg_catalog.setval('public.clients_id_seq', 7, true);


--
-- Name: counter_offers_counter_offer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: craig
--

SELECT pg_catalog.setval('public.counter_offers_counter_offer_id_seq', 4, true);


--
-- Name: offer_notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: craig
--

SELECT pg_catalog.setval('public.offer_notifications_notification_id_seq', 15, true);


--
-- Name: offers_offer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: craig
--

SELECT pg_catalog.setval('public.offers_offer_id_seq', 98, true);


--
-- Name: properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: craig
--

SELECT pg_catalog.setval('public.properties_id_seq', 184, true);


--
-- Name: saved_properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: craig
--

SELECT pg_catalog.setval('public.saved_properties_id_seq', 273, true);


--
-- Name: showing_times_id_seq; Type: SEQUENCE SET; Schema: public; Owner: craig
--

SELECT pg_catalog.setval('public.showing_times_id_seq', 30, true);


--
-- Name: showings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: craig
--

SELECT pg_catalog.setval('public.showings_id_seq', 1, true);


--
-- Name: user_notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: craig
--

SELECT pg_catalog.setval('public.user_notifications_notification_id_seq', 27, true);


--
-- Name: app_config app_config_config_key_key; Type: CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.app_config
    ADD CONSTRAINT app_config_config_key_key UNIQUE (config_key);


--
-- Name: app_config app_config_pkey; Type: CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.app_config
    ADD CONSTRAINT app_config_pkey PRIMARY KEY (id);


--
-- Name: clients clients_client_uid_key; Type: CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_client_uid_key UNIQUE (client_uid);


--
-- Name: clients clients_email_key; Type: CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key UNIQUE (email);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: counter_offers counter_offers_pkey; Type: CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.counter_offers
    ADD CONSTRAINT counter_offers_pkey PRIMARY KEY (counter_offer_id);


--
-- Name: offer_notifications offer_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.offer_notifications
    ADD CONSTRAINT offer_notifications_pkey PRIMARY KEY (notification_id);


--
-- Name: offers offers_offer_uid_key; Type: CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_offer_uid_key UNIQUE (offer_uid);


--
-- Name: offers offers_pkey; Type: CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_pkey PRIMARY KEY (offer_id);


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- Name: properties properties_property_uid_key; Type: CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_property_uid_key UNIQUE (property_uid);


--
-- Name: saved_properties saved_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.saved_properties
    ADD CONSTRAINT saved_properties_pkey PRIMARY KEY (id);


--
-- Name: saved_properties saved_properties_user_email_property_uid_key; Type: CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.saved_properties
    ADD CONSTRAINT saved_properties_user_email_property_uid_key UNIQUE (user_email, property_uid);


--
-- Name: showing_times showing_times_pkey; Type: CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.showing_times
    ADD CONSTRAINT showing_times_pkey PRIMARY KEY (id);


--
-- Name: showings showings_pkey; Type: CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.showings
    ADD CONSTRAINT showings_pkey PRIMARY KEY (id);


--
-- Name: user_notifications user_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_pkey PRIMARY KEY (notification_id);


--
-- Name: idx_app_config_key; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_app_config_key ON public.app_config USING btree (config_key);


--
-- Name: idx_clients_client_uid; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_clients_client_uid ON public.clients USING btree (client_uid);


--
-- Name: idx_counter_offers_original_offer; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_counter_offers_original_offer ON public.counter_offers USING btree (original_offer_id);


--
-- Name: idx_counter_offers_original_offer_uid; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_counter_offers_original_offer_uid ON public.counter_offers USING btree (original_offer_uid);


--
-- Name: idx_notifications_read; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_notifications_read ON public.offer_notifications USING btree (read_at);


--
-- Name: idx_notifications_recipient; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_notifications_recipient ON public.offer_notifications USING btree (recipient_email);


--
-- Name: idx_notifications_type; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_notifications_type ON public.offer_notifications USING btree (type);


--
-- Name: idx_offers_buyer_email; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_offers_buyer_email ON public.offers USING btree (buyer_email);


--
-- Name: idx_offers_created_at; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_offers_created_at ON public.offers USING btree (created_at);


--
-- Name: idx_offers_offer_uid; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_offers_offer_uid ON public.offers USING btree (offer_uid);


--
-- Name: idx_offers_property_uid; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_offers_property_uid ON public.offers USING btree (property_uid);


--
-- Name: idx_offers_seller_email; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_offers_seller_email ON public.offers USING btree (seller_email);


--
-- Name: idx_offers_status; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_offers_status ON public.offers USING btree (status);


--
-- Name: idx_properties_city; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_properties_city ON public.properties USING btree (city);


--
-- Name: idx_properties_client_uid; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_properties_client_uid ON public.properties USING btree (client_uid);


--
-- Name: idx_properties_color; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_properties_color ON public.properties USING btree (property_color);


--
-- Name: idx_properties_location; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_properties_location ON public.properties USING btree (latitude, longitude);


--
-- Name: idx_properties_postal_code; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_properties_postal_code ON public.properties USING btree (postal_code);


--
-- Name: idx_properties_property_uid; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_properties_property_uid ON public.properties USING btree (property_uid);


--
-- Name: idx_properties_province; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_properties_province ON public.properties USING btree (province);


--
-- Name: idx_properties_search_vector; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_properties_search_vector ON public.properties USING gin (search_vector);


--
-- Name: idx_properties_user_email; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_properties_user_email ON public.properties USING btree (user_email);


--
-- Name: idx_properties_uuid; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_properties_uuid ON public.properties USING btree (uuid);


--
-- Name: idx_saved_properties_property_uid; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_saved_properties_property_uid ON public.saved_properties USING btree (property_uid);


--
-- Name: idx_saved_properties_user_email; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_saved_properties_user_email ON public.saved_properties USING btree (user_email);


--
-- Name: idx_saved_properties_user_property; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_saved_properties_user_property ON public.saved_properties USING btree (user_email, property_uid);


--
-- Name: idx_showing_times_end_time; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_showing_times_end_time ON public.showing_times USING btree (end_time);


--
-- Name: idx_showing_times_property_time_range; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_showing_times_property_time_range ON public.showing_times USING btree (property_uid, start_time, end_time);


--
-- Name: idx_showing_times_property_uid; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_showing_times_property_uid ON public.showing_times USING btree (property_uid);


--
-- Name: idx_showing_times_start_time; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_showing_times_start_time ON public.showing_times USING btree (start_time);


--
-- Name: idx_showings_property_uid; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_showings_property_uid ON public.showings USING btree (property_uid);


--
-- Name: idx_user_notifications_created_at; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_user_notifications_created_at ON public.user_notifications USING btree (created_at);


--
-- Name: idx_user_notifications_offer_uid; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_user_notifications_offer_uid ON public.user_notifications USING btree (related_offer_uid);


--
-- Name: idx_user_notifications_read_at; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_user_notifications_read_at ON public.user_notifications USING btree (read_at);


--
-- Name: idx_user_notifications_type; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_user_notifications_type ON public.user_notifications USING btree (type);


--
-- Name: idx_user_notifications_user_email; Type: INDEX; Schema: public; Owner: craig
--

CREATE INDEX idx_user_notifications_user_email ON public.user_notifications USING btree (user_email);


--
-- Name: showing_times trigger_update_showing_times_updated_at; Type: TRIGGER; Schema: public; Owner: craig
--

CREATE TRIGGER trigger_update_showing_times_updated_at BEFORE UPDATE ON public.showing_times FOR EACH ROW EXECUTE FUNCTION public.update_showing_times_updated_at();


--
-- Name: app_config update_app_config_updated_at; Type: TRIGGER; Schema: public; Owner: craig
--

CREATE TRIGGER update_app_config_updated_at BEFORE UPDATE ON public.app_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: offers update_offers_updated_at; Type: TRIGGER; Schema: public; Owner: craig
--

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.update_offers_updated_at();


--
-- Name: counter_offers counter_offers_original_offer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.counter_offers
    ADD CONSTRAINT counter_offers_original_offer_id_fkey FOREIGN KEY (original_offer_id) REFERENCES public.offers(offer_id) ON DELETE CASCADE;


--
-- Name: properties fk_properties_client_uid; Type: FK CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT fk_properties_client_uid FOREIGN KEY (client_uid) REFERENCES public.clients(client_uid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: showing_times fk_showing_times_property_uid; Type: FK CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.showing_times
    ADD CONSTRAINT fk_showing_times_property_uid FOREIGN KEY (property_uid) REFERENCES public.properties(property_uid) ON DELETE CASCADE;


--
-- Name: offer_notifications offer_notifications_offer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.offer_notifications
    ADD CONSTRAINT offer_notifications_offer_id_fkey FOREIGN KEY (offer_id) REFERENCES public.offers(offer_id) ON DELETE CASCADE;


--
-- Name: properties properties_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id);


--
-- Name: saved_properties saved_properties_property_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.saved_properties
    ADD CONSTRAINT saved_properties_property_uid_fkey FOREIGN KEY (property_uid) REFERENCES public.properties(property_uid) ON DELETE CASCADE;


--
-- Name: user_notifications user_notifications_related_offer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: craig
--

ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_related_offer_id_fkey FOREIGN KEY (related_offer_id) REFERENCES public.offers(offer_id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

